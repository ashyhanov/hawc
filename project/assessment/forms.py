from django.core.mail import send_mail, mail_admins
from django import forms
from django.conf import settings
from django.core.urlresolvers import reverse_lazy
from django.contrib.contenttypes.models import ContentType

from selectable.forms import AutoCompleteWidget, AutoCompleteSelectMultipleWidget
from pagedown.widgets import PagedownWidget
from markdown_deux import markdown
from utils.forms import BaseFormHelper

from myuser.lookups import HAWCUserLookup

from . import models, lookups


class AssessmentForm(forms.ModelForm):

    class Meta:
        exclude = ('enable_literature_review',
                   'enable_data_extraction',
                   'enable_study_quality',
                   'enable_bmd',
                   'enable_reference_values',
                   'enable_summary_text',
                   'enable_comments')
        model = models.Assessment

    def __init__(self, *args, **kwargs):
        super(AssessmentForm, self).__init__(*args, **kwargs)

        self.fields['project_manager'].widget = AutoCompleteSelectMultipleWidget(
            lookup_class=HAWCUserLookup)
        self.fields['team_members'].widget = AutoCompleteSelectMultipleWidget(
            lookup_class=HAWCUserLookup)
        self.fields['reviewers'].widget = AutoCompleteSelectMultipleWidget(
            lookup_class=HAWCUserLookup)

        self.helper = self.setHelper()

    def setHelper(self):
        # by default take-up the whole row-fluid
        for fld in self.fields.keys():
            widget = self.fields[fld].widget
            if type(widget) != forms.CheckboxInput:
                widget.attrs['class'] = 'span12'
            if type(widget) == forms.Textarea:
                widget.attrs['rows'] = 3
                widget.attrs['class'] += " html5text"

        if self.instance.id:
            inputs = {
                "legend_text": u"Update {}".format(self.instance),
                "help_text":   u"Update an existing HAWC assessment.<br><br>* required fields",
                "cancel_url": self.instance.get_absolute_url()
            }
        else:
            inputs = {
                "legend_text": u"Create new assessment",
                "help_text":   u"""
                    Assessments are the fundamental objects in HAWC; all data added to the
                    tool will be related to an assessment. The settings below are used to
                    describe the basic characteristics of the assessment, along with setting
                    up permissions for role-based authorization and access for viewing and
                    editing content associated with an assessment.<br><br>* required fields""",
                "cancel_url": reverse_lazy('portal')
            }

        helper = BaseFormHelper(self, **inputs)
        helper.form_class = None
        helper.add_fluid_row('name', 2, "span6")
        helper.add_fluid_row('version', 2, "span6")
        helper.add_fluid_row('project_manager', 3, "span4")
        return helper


class AssessmentModulesForm(forms.ModelForm):

    class Meta:
        fields = ('enable_literature_review',
                  'enable_data_extraction',
                  'enable_study_quality',
                  'enable_bmd',
                  'enable_reference_values',
                  'enable_summary_text',
                  'enable_comments')
        model = models.Assessment

    def __init__(self, *args, **kwargs):
        super(AssessmentModulesForm, self).__init__(*args, **kwargs)
        self.helper = self.setHelper()

    def setHelper(self):
        inputs = {
            "legend_text": u"Update enabled modules",
            "help_text":   u"""
                HAWC is composed of multiple modules, each designed
                to capture data and decisions related to specific components of a
                health assessment. This screen allows a project-manager to change
                which modules are enabled for this assessment. Modules can be
                enabled or disabled at any time; content already entered into a particular
                module will not be changed when enabling or disabling modules.
                """,
            "cancel_url": self.instance.get_absolute_url()
        }
        helper = BaseFormHelper(self, **inputs)
        helper.form_class = None
        return helper


class AttachmentForm(forms.ModelForm):
    class Meta:
        model = models.Attachment
        exclude = ('content_type', 'object_id', 'content_object')

    def __init__(self, *args, **kwargs):
        obj = kwargs.pop('parent', None)
        super(AttachmentForm, self).__init__(*args, **kwargs)
        if obj:
            self.instance.content_type = ContentType.objects.get_for_model(obj)
            self.instance.object_id = obj.id
            self.instance.content_object = obj
        self.helper = self.setHelper()

    def setHelper(self):
        # by default take-up the whole row-fluid
        for fld in self.fields.keys():
            widget = self.fields[fld].widget
            if type(widget) != forms.CheckboxInput:
                widget.attrs['class'] = 'span12'
            if type(widget) == forms.Textarea:
                widget.attrs['rows'] = 3
                widget.attrs['class'] += " html5text"

        if self.instance.id:
            inputs = {"legend_text": u"Update {}".format(self.instance)}
        else:
            inputs = {"legend_text": u"Create new attachment"}
        inputs["cancel_url"] = self.instance.get_absolute_url()

        helper = BaseFormHelper(self, **inputs)
        helper.form_class = None
        return helper


class EffectTagForm(forms.ModelForm):

    class Meta:
        model = models.EffectTag
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        kwargs.pop('parent')
        super(EffectTagForm, self).__init__(*args, **kwargs)
        self.fields['name'].widget = AutoCompleteWidget(
            lookup_class=lookups.EffectTagLookup,
            allow_new=True)
        for fld in self.fields.keys():
            self.fields[fld].widget.attrs['class'] = 'span12'


class ReportTemplateForm(forms.ModelForm):

    class Meta:
        model = models.ReportTemplate
        exclude = ('assessment', )

    def __init__(self, *args, **kwargs):
        parent = kwargs.pop('parent', None)
        super(ReportTemplateForm, self).__init__(*args, **kwargs)

        for fld in ('description', 'report_type'):
            self.fields[fld].widget.attrs['class'] = 'span12'

        if parent:
            self.instance.assessment = parent


class AssessmentEmailManagersForm(forms.Form):
    subject = forms.CharField(max_length=100)
    message = forms.CharField(widget=PagedownWidget())

    def send_email(self):
        from_email = settings.DEFAULT_FROM_EMAIL
        subject = "[HAWC] {0}" .format(self.cleaned_data['subject'])
        message = ""
        recipient_list = self.assessment.get_project_manager_emails()
        html_message = markdown(self.cleaned_data['message'])
        send_mail(subject, message, from_email, recipient_list,
                  html_message=html_message,
                  fail_silently=False)

    def __init__(self, *args, **kwargs):
        self.assessment = kwargs.pop('assessment', None)
        super(AssessmentEmailManagersForm, self).__init__(*args, **kwargs)
        for key in self.fields.keys():
            self.fields[key].widget.attrs['class'] = 'span12'


class ContactForm(forms.Form):
    name = forms.CharField(max_length=100)
    email = forms.EmailField()
    subject = forms.CharField(max_length=100)
    message = forms.CharField(widget=forms.Textarea)

    def send_email(self):
        subject = u'[HAWC contact us]: {}'.format(self.cleaned_data['subject'])
        content = u'{0}\n\n{1}\n{2}'.format(
            self.cleaned_data['message'],
            self.cleaned_data['name'],
            self.cleaned_data['email']
        )
        mail_admins(subject, content, fail_silently=False)

    def __init__(self, *args, **kwargs):
        self.back_href = kwargs.pop('back_href', None)
        super(ContactForm, self).__init__(*args, **kwargs)
        self.helper = self.setHelper()

    def setHelper(self):
        # by default take-up the whole row-fluid
        for fld in self.fields.keys():
            widget = self.fields[fld].widget
            if type(widget) != forms.CheckboxInput:
                widget.attrs['class'] = 'span12'

        inputs = {
            "legend_text": u"Contact HAWC developers",
            "help_text": u"""
                Have a question, comment, or need some help?
                Use this form to to let us know what's going on.
            """,
            "cancel_url": self.back_href

        }
        helper = BaseFormHelper(self, **inputs)
        helper.form_class = "loginForm"
        return helper
