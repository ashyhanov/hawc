from collections import Counter
import json
import operator

from django import forms
from django.forms import ModelForm, ValidationError, Select
from django.forms.models import BaseModelFormSet, inlineformset_factory, modelformset_factory
from django.forms.util import flatatt
from django.utils.safestring import mark_safe
from django.db.models import Q

from crispy_forms import layout as cfl
from crispy_forms import bootstrap as cfb
from selectable import forms as selectable

from assessment.models import Assessment
from assessment.lookups import EffectTagLookup
from study.lookups import AnimalStudyLookup
from utils.helper import HAWCDjangoJSONEncoder
from utils.forms import BaseFormHelper

from . import models, lookups


class ExperimentForm(ModelForm):

    class Meta:
        model = models.Experiment
        exclude = ('study',)

    def __init__(self, *args, **kwargs):
        parent = kwargs.pop('parent', None)
        super(ExperimentForm, self).__init__(*args, **kwargs)
        if parent:
            self.instance.study = parent
        self.helper = self.setHelper()

    def setHelper(self):

        # by default take-up the whole row-fluid
        for fld in self.fields.keys():
            widget = self.fields[fld].widget
            if type(widget) != forms.CheckboxInput:
                widget.attrs['class'] = 'span12'

        self.fields["diet"].widget.attrs['rows'] = 3
        self.fields["description"].widget.attrs['rows'] = 4

        if self.instance.id:
            inputs = {
                "legend_text": u"Update {}".format(self.instance),
                "help_text":   u"Update an existing experiment.",
                "cancel_url": self.instance.get_absolute_url()
            }
        else:
            inputs = {
                "legend_text": u"Create new experiment",
                "help_text":   u"""
                    Create a new experiment. Each experiment is a associated with a
                    study, and may have one or more collections of animals. For
                    example, one experiment may be a 2-year cancer bioassay,
                    while another multi-generational study. It is possible to
                    create multiple separate experiments within a single study,
                    with different study-designs, durations, or test-species.""",
                "cancel_url": self.instance.study.get_absolute_url()
            }

        helper = BaseFormHelper(self, **inputs)
        helper.form_class = None
        helper.add_fluid_row('name', 2, "span6")
        helper.add_fluid_row('chemical', 3, "span4")
        helper.add_fluid_row('purity_available', 3, "span4")
        helper.add_fluid_row('litter_effects', 2, "span6")
        helper.add_fluid_row('diet', 2, "span6")
        return helper

    def clean(self):
        super(ExperimentForm, self).clean()

        # If purity was provided, make sure purity_available is True
        if self.cleaned_data.get('purity', None) is not None:
            self.cleaned_data['purity_available'] = True

        return self.cleaned_data

    def clean_purity(self):
        purity = self.cleaned_data.get("purity", None)
        purity_available = self.cleaned_data.get("purity_available")
        if purity_available and purity is None:
            raise forms.ValidationError("If purity data are available, value must be provided.")
        return purity

    def clean_purity_available(self):
        purity = self.cleaned_data.get("purity", None)
        purity_available = self.cleaned_data.get("purity_available")
        if purity is not None:
            purity_available = True
        return purity_available

    def clean_litter_effects(self):
        type = self.cleaned_data.get("type")
        litter_effects = self.cleaned_data.get("litter_effects")
        if type in ["Rp", "Dv"]:
            if litter_effects == "NA":
                raise forms.ValidationError("Litter effects required if a reproductive/developmental study")
        elif type != "Ot" and litter_effects != "NA":
            raise forms.ValidationError("Litter effects must be NA if non-reproductive/developmental study")
        return litter_effects

    def clean_litter_effect_notes(self):
        litter_effects = self.cleaned_data.get("litter_effects")
        litter_effect_notes = self.cleaned_data.get("litter_effect_notes")
        if litter_effects == "NA" and litter_effect_notes != "":
            raise forms.ValidationError("Litter effect notes should be blank if effects are not-applicable")
        if litter_effects == "O" and litter_effect_notes == "":
            raise forms.ValidationError('Notes are required if litter effects are "Other"')
        return litter_effect_notes


class AnimalGroupForm(ModelForm):

    class Meta:
        model = models.AnimalGroup
        exclude = ('experiment', 'dosing_regime', 'generation',  'parents')

    def __init__(self, *args, **kwargs):
        parent = kwargs.pop('parent', None)
        super(AnimalGroupForm, self).__init__(*args, **kwargs)

        if parent:
            self.instance.experiment = parent

        if self.instance.id:
            self.fields['strain'].queryset = models.Strain.objects.filter(
                species=self.instance.species)

        self.fields['lifestage_exposed'].widget = selectable.AutoCompleteWidget(
            lookup_class=lookups.AnimalGroupLifestageExposedLookup,
            allow_new=True)

        self.fields['lifestage_assessed'].widget = selectable.AutoCompleteWidget(
            lookup_class=lookups.AnimalGroupLifestageAssessedLookup,
            allow_new=True)

        self.fields['siblings'].queryset = models.AnimalGroup.objects.filter(
                experiment=self.instance.experiment)

        self.helper = self.setHelper()
        self.fields['comments'].widget.attrs['rows'] = 4

    def setHelper(self):
        for fld in self.fields.keys():
            widget = self.fields[fld].widget
            if fld in ["species", "strain"]:
                widget.attrs['class'] = 'span10'
            else:
                widget.attrs['class'] = 'span12'

        if self.instance.id:
            inputs = {
                "legend_text": u"Update {}".format(self.instance),
                "help_text":   u"Update an existing animal-group.",
                "cancel_url": self.instance.get_absolute_url()
            }
        else:
            inputs = {
                "legend_text": u"Create new animal-group",
                "help_text":   u"""
                    Create a new animal-group. Each animal-group is a set of
                    animals which are comparable for a given experiment. For
                    example, they may be a group of F1 rats. Animal-groups may
                    have different exposures or doses, but should be otherwise
                    comparable.""",
                "cancel_url": self.instance.experiment.get_absolute_url()
            }

        helper = BaseFormHelper(self, **inputs)
        helper.form_class = None
        helper.form_id = "animal_group"
        helper.add_adder("addSpecies", "Add new species", '{% url "animal:species_create" assessment.pk %}')
        helper.add_adder("addStrain", "Add new strain", '{% url "animal:strain_create" assessment.pk %}')
        helper.add_fluid_row('species', 3, "span4")
        helper.add_fluid_row('lifestage_exposed', 3, "span4")
        if "generation" in self.fields:
            helper.add_fluid_row('siblings', 3, "span4")
        return helper


class GenerationalAnimalGroupForm(AnimalGroupForm):

    class Meta:
        model = models.AnimalGroup
        exclude = ('experiment', )

    def __init__(self, *args, **kwargs):
        super(GenerationalAnimalGroupForm, self).__init__(*args, **kwargs)
        self.fields['generation'].choices = self.fields['generation'].choices[1:]
        self.fields['parents'].queryset = models.AnimalGroup.objects.filter(
            experiment=self.instance.experiment)
        self.fields['dosing_regime'].queryset = models.DosingRegime.objects.filter(
                dosed_animals__in=self.fields['parents'].queryset)


class DosingRegimeForm(ModelForm):

    class Meta:
        model = models.DosingRegime
        exclude = ('dosed_animals',)

    def __init__(self, *args, **kwargs):
        super(DosingRegimeForm, self).__init__(*args, **kwargs)
        self.helper = self.setHelper()

    def setHelper(self):

        self.fields['description'].widget.attrs['rows'] = 4
        for fld in self.fields.keys():
            self.fields[fld].widget.attrs['class'] = 'span12'

        if self.instance.id:
            inputs = {
                "legend_text": u"Update dosing regime",
                "help_text":   u"Update an existing dosing-regime.",
                "cancel_url": self.instance.dosed_animals.get_absolute_url()
            }
        else:
            inputs = {
                "legend_text": u"Create new dosing-regime",
                "help_text":   u"""
                    Create a new dosing-regime. Each dosing-regime is one
                    protocol for how animals were dosed. Multiple different
                    dose-metrics can be associated with one dosing regime. If
                    this is a generational-experiment, you may not need to create
                    a new dosing-regime, but could instead specify the dosing
                    regime of parents or other ancestors.""",
            }

        helper = BaseFormHelper(self, **inputs)
        helper.form_class = None
        helper.form_id = "dosing_regime"
        helper.add_fluid_row('route_of_exposure', 3, "span4")
        helper.add_fluid_row('num_dose_groups', 3, "span4")
        return helper


class DoseGroupForm(ModelForm):

    class Meta:
        model = models.DoseGroup
        fields = ('dose_units', 'dose_group_id', 'dose')


class BaseDoseGroupFormSet(BaseModelFormSet):

    def __init__(self, *args, **kwargs):
        super(BaseDoseGroupFormSet, self).__init__(*args, **kwargs)
        self.queryset = models.DoseGroup.objects.none()

    def clean(self, **kwargs):
        """
        Ensure that the selected dose_groups fields have an number of dose_groups
        equal to those expected from the animal dose group, and that all dose
        ids have all dose groups.
        """
        if any(self.errors):
            return

        dose_units = Counter()
        dose_group = Counter()
        num_dose_groups = self.data['num_dose_groups']
        dose_groups = self.cleaned_data

        if len(dose_groups)<1:
            raise forms.ValidationError("<ul><li>At least one set of dose-units must be presented!</li></ul>")

        for dose in dose_groups:
            dose_units[dose['dose_units']] += 1
            dose_group[dose['dose_group_id']] += 1

        for dose_unit in dose_units.itervalues():
            if dose_unit != num_dose_groups:
                raise forms.ValidationError('<ul><li>Each dose-type must have {} dose groups</li></ul>'.format(num_dose_groups))

        if not all(dose_group.values()[0] == group for group in dose_group.values()):
            raise forms.ValidationError('<ul><li>All dose ids must be equal to the same number of values</li></ul>')


def dosegroup_formset_factory(groups, num_dose_groups):

    data = {
        u'form-TOTAL_FORMS': str(len(groups)),
        u'form-INITIAL_FORMS': 0,
        u'num_dose_groups': num_dose_groups
    }

    for i, v in enumerate(groups):
        data[u"form-{}-dose_group_id".format(i)] = str(v.get('dose_group_id', ""))
        data[u"form-{}-dose_units".format(i)] = str(v.get('dose_units', ""))
        data[u"form-{}-dose".format(i)] = str(v.get('dose', ""))

    FS = modelformset_factory(
            models.DoseGroup,
            form=DoseGroupForm,
            formset=BaseDoseGroupFormSet,
            extra=len(groups))

    return FS(data)


class EndpointForm(ModelForm):

    effects = selectable.AutoCompleteSelectMultipleField(
        lookup_class=EffectTagLookup,
        required=False,
        help_text="Any additional descriptive-tags used to categorize the outcome",
        label="Additional tags"
    )

    class Meta:
        model = models.Endpoint
        fields = ('name',
                  'system', 'organ', 'effect',
                  'effects', 'diagnostic',
                  'observation_time', 'observation_time_units',
                  'data_reported', 'data_extracted', 'values_estimated',
                  'data_type', 'variance_type', 'confidence_interval',
                  'response_units', 'data_location',
                  'NOEL', 'LOEL', 'FEL',
                  'monotonicity', 'statistical_test', 'trend_value',
                  'power_notes', 'results_notes', 'endpoint_notes')

    def __init__(self, *args, **kwargs):
        animal_group = kwargs.pop('parent', None)
        assessment = kwargs.pop('assessment', None)
        super(EndpointForm, self).__init__(*args, **kwargs)

        self.fields['NOEL'].widget = forms.Select()
        self.fields['LOEL'].widget = forms.Select()
        self.fields['FEL'].widget = forms.Select()

        self.fields['system'].widget = selectable.AutoCompleteWidget(
            lookup_class=lookups.EndpointSystemLookup,
            allow_new=True)

        self.fields['organ'].widget = selectable.AutoCompleteWidget(
            lookup_class=lookups.EndpointOrganLookup,
            allow_new=True)

        self.fields['effect'].widget = selectable.AutoCompleteWidget(
            lookup_class=lookups.EndpointEffectLookup,
            allow_new=True)

        self.fields['statistical_test'].widget = selectable.AutoCompleteWidget(
            lookup_class=lookups.EndpointStatisticalTestLookup,
            allow_new=True)

        if animal_group:
            self.instance.animal_group = animal_group
            self.instance.assessment = assessment

        self.fields["name"].help_text = """
            Short-text used to describe the endpoint.
            Should include observation-time,
            if multiple endpoints have the same observation time."""

        self.helper = self.setHelper()

    def setHelper(self):
        if self.instance.id:
            inputs = {
                "legend_text": u"Update {}".format(self.instance),
                "help_text":   u"Update an existing endpoint.",
                "cancel_url": self.instance.get_absolute_url()
            }
        else:
            inputs = {
                "legend_text": u"Create new endpoint",
                "help_text":   u"""
                    Create a new endpoint. An endpoint may should describe one
                    measure-of-effect which was measured in the study. It may
                    or may not contain quantitative data.""",
                "cancel_url": self.instance.animal_group.get_absolute_url()
            }

        helper = BaseFormHelper(self, **inputs)
        helper.form_class = None
        helper.form_id = "endpoint"
        helper.add_adder("addEffectTag",
                         "Add new effect tag",
                         '{% url "assessment:effect_tag_create" assessment.pk %}')

        self.fields['diagnostic'].widget.attrs['rows'] = 2
        for fld in ('results_notes', 'endpoint_notes', 'power_notes'):
            self.fields[fld].widget.attrs['rows'] = 3

        # by default take-up the whole row-fluid
        for fld in self.fields.keys():
            widget = self.fields[fld].widget
            if type(widget) != forms.CheckboxInput:
                widget.attrs['class'] = 'span12'

        helper.add_fluid_row('system', 3, "span4")
        helper.add_fluid_row('effects', 2, "span6")
        helper.add_fluid_row('data_type', 3, "span4")
        helper.add_fluid_row('observation_time', 2, "span6")
        helper.add_fluid_row('data_reported', 4, "span4")
        helper.add_fluid_row('response_units', 2, "span6")
        helper.add_fluid_row('NOEL', 3, "span4")
        helper.add_fluid_row('monotonicity', 3, ["span2", "span5", "span5"])

        return helper

    def clean(self):
        cleaned_data = super(EndpointForm, self).clean()
        obs_time = cleaned_data.get("observation_time")
        observation_time_units = cleaned_data.get("observation_time_units")

        if obs_time is not None and observation_time_units == 0:
            err = "If reporting an endpoint-observation time, time-units must be specified."
            self.add_error('observation_time_units', err)

        if obs_time is None and observation_time_units > 0:
            err = "An observation-time must be reported if time-units are specified"
            self.add_error('observation_time', err)

    def clean_confidence_interval(self):
        confidence_interval = self.cleaned_data['confidence_interval']
        data_type = self.cleaned_data.get("data_type")
        if data_type == "P" and confidence_interval is None:
            raise forms.ValidationError("Confidence-interval is required for"
                                        "percent-difference data")
        return confidence_interval

    def clean_variance_type(self):
        data_type = self.cleaned_data.get("data_type")
        variance_type = self.cleaned_data.get("variance_type")
        if data_type == "C" and variance_type == 0:
            raise forms.ValidationError(
                "If entering continuous data, the variance type must be SD"
                "(standard-deviation) or SE (standard error)")
        return variance_type


class EndpointGroupForm(forms.ModelForm):

    class Meta:
        exclude = ('endpoint', 'dose_group_id', 'significant')
        model = models.EndpointGroup

    def __init__(self, *args, **kwargs):
        endpoint = kwargs.pop('endpoint', None)
        super(EndpointGroupForm, self).__init__(*args, **kwargs)
        if endpoint:
            self.instance.endpoint = endpoint
        for fld in self.fields:
            self.fields[fld].widget.attrs['class'] = 'span12'

    def clean(self):
        super(EndpointGroupForm, self).clean()
        data = self.cleaned_data
        data_type = self.endpoint_form.cleaned_data['data_type']
        var_type = self.endpoint_form.cleaned_data.get('variance_type', 0)

        if data_type == 'C':
            var = data.get("variance")
            if var is not None and var_type in (0, 3):
                msg = 'Variance must be numeric, or the endpoint-field "variance-type" should be "not reported"'
                self.add_error('variance', msg)
        elif data_type == 'P':
            if data.get("lower_ci") is None and data.get("upper_ci") is not None:
                msg = 'A lower CI must be provided if an upper CI is provided'
                self.add_error('lower_ci', msg)
            if data.get("lower_ci") is not None and data.get("upper_ci") is None:
                msg = 'An upper CI must be provided if an lower CI is provided'
                self.add_error('upper_ci', msg)
        elif data_type in ["D", "DC"]:
            if data.get("incidence") is None and data.get("n") is not None:
                msg = 'An Incidence must be provided if an N is provided'
                self.add_error('incidence', msg)
            if data.get("incidence") is not None and data.get("n") is None:
                msg = 'An N must be provided if an Incidence is provided'
                self.add_error('n', msg)
            if data.get("n") < data.get("incidence"):
                msg = 'Incidence must be less-than or equal-to N'
                self.add_error('incidence', msg)

        return data


class BaseEndpointGroupFormSet(BaseModelFormSet):

    def __init__(self, **defaults):
        super(BaseEndpointGroupFormSet, self).__init__(**defaults)
        if len(self.forms) > 0:
            self.forms[0].fields['significance_level'].widget.attrs['class'] += " hidden"


EndpointGroupFormSet = modelformset_factory(
    models.EndpointGroup,
    form=EndpointGroupForm,
    formset=BaseEndpointGroupFormSet,
    extra=0)


class EndpointSelectorForm(forms.Form):
    model = models.Endpoint
    selector = selectable.AutoCompleteSelectField(
        lookup_class=lookups.EndpointByStudyLookup,
        label='Endpoint',
        widget=selectable.AutoComboboxSelectWidget)

    def __init__(self, *args, **kwargs):
        super(EndpointSelectorForm, self).__init__(*args, **kwargs)
        for fld in self.fields.keys():
            self.fields[fld].widget.attrs['class'] = 'span11'


class UploadFileForm(forms.Form):
    file = forms.FileField()


class IndividualAnimalForm(ModelForm):

    class Meta:
        model = models.IndividualAnimal
        fields = '__all__'


class UncertaintyFactorEndpointForm(ModelForm):
    """
    Custom form for UF to ensure that the endpoint is not changed when a user
    edits the form.
    """
    def __init__(self, *args, **kwargs):
        endpoint = kwargs.pop('parent', None)
        super(UncertaintyFactorEndpointForm, self).__init__(*args, **kwargs)
        if endpoint:
            self.instance.endpoint = endpoint

    class Meta:
        model = models.UncertaintyFactorEndpoint
        exclude = ('endpoint', )


class AJAXUncertaintyFactorEndpointForm(ModelForm):
    """
    No manipulation of endpoint with form.
    """
    class Meta:
        model = models.UncertaintyFactorEndpoint
        fields = '__all__'


class HiddenSelectBox(Select):
    """
    Special-case for a select-box where the selector should be hidden and a
    text-version of the selected field should be displayed.
    """
    def render(self, name, value, attrs=None, choices=()):
        if value is None: value = ''
        pretty_choice = ''
        for k, v in self.choices:
            if k == value:
                pretty_choice = v

        final_attrs = self.build_attrs(attrs, name=name)
        final_attrs['style'] = ' '.join([final_attrs.get('style', ''), 'display:none;'])
        output = [u'<b>' + unicode(pretty_choice) + '</b><select%s>' % flatatt(final_attrs)]
        options = self.render_options(choices, [value])
        if options:
            output.append(options)
        output.append(u'</select>')
        return mark_safe(u'\n'.join(output))


class UncertaintyFactorRefValForm(ModelForm):
    """
    Custom form for UF to ensure that the endpoint is not changed when a user
    edits the form.
    """

    def __init__(self, *args, **kwargs):
        reference_value_pk = kwargs.pop('reference_value_pk', None)
        super(UncertaintyFactorRefValForm, self).__init__(*args, **kwargs)
        self.fields['value'].widget.attrs['class'] = 'span12 uf_values'
        self.fields['uf_type'].widget = HiddenSelectBox(
            choices=models.UncertaintyFactorAbstract.UF_TYPE_CHOICES)
        self.fields['uf_type'].widget.attrs['class'] = 'span12'
        self.fields['description'].widget.attrs['class'] = 'span12 uf_descriptions'
        if reference_value_pk:
            self.instance.reference_value = models.ReferenceValue.objects.get(pk=reference_value_pk)

    class Meta:
        model = models.UncertaintyFactorRefVal
        exclude = ('reference_value', )


class AggregationForm(ModelForm):

    def __init__(self, *args, **kwargs):
        assessment = kwargs.pop('parent', None)
        super(AggregationForm, self).__init__(*args, **kwargs)

        if assessment:
            self.instance.assessment = assessment

        # endpoints dependent on dose-units
        if self.instance.pk is None:
            self.fields['endpoints'].queryset = models.Endpoint.objects.none()
        else:
            self.fields['endpoints'].queryset = self.instance.endpoints.all()

    class Meta:
        model = models.Aggregation
        exclude = ('assessment',)


class AggregationSearchForm(forms.Form):
    name = forms.CharField(required=True)

    def __init__(self, *args, **kwargs):
        assessment_pk = kwargs.pop('assessment_pk', None)
        super(AggregationSearchForm, self).__init__(*args, **kwargs)
        if assessment_pk:
            self.assessment = Assessment.objects.get(pk=assessment_pk)

    def search(self):
        query = {}
        if self.cleaned_data['name']:
            query['name__icontains'] = self.cleaned_data['name']

        response_json = []
        for obj in models.Aggregation.objects\
                         .filter(assessment=self.assessment).filter(**query):
            response_json.append(obj.get_json(json_encode=False))
        return response_json


class ReferenceValueForm(ModelForm):
    def __init__(self, *args, **kwargs):
        assessment = kwargs.pop('parent', None)
        super(ReferenceValueForm, self).__init__(*args, **kwargs)
        if assessment:
            self.instance.assessment = assessment

        self.fields['aggregation'].queryset = models.Aggregation.objects\
            .filter(assessment=self.instance.assessment)

    class Meta:
        model = models.ReferenceValue
        exclude = ('assessment', 'aggregate_uf', 'reference_value')


class Base_UFRefVal_FormSet(BaseModelFormSet):
    def clean(self):
        """Checks that all uncertainty-factor types are unique."""
        if any(self.errors):
            return
        ufs = []
        for form in self.forms:
            uf = form.cleaned_data['uf_type']
            if uf in ufs:
                raise ValidationError("Uncertainty-factors must be unique for"
                                      "a given reference-value.")
            ufs.append(uf)


UFRefValFormSet = inlineformset_factory(
        models.ReferenceValue,
        models.UncertaintyFactorRefVal,
        form=UncertaintyFactorRefValForm,
        formset=Base_UFRefVal_FormSet,
        extra=0,
        can_delete=False
    )


class SpeciesForm(ModelForm):

    class Meta:
        model = models.Species
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        kwargs.pop('parent', None)
        super(SpeciesForm, self).__init__(*args, **kwargs)

    def clean_name(self):
        return self.cleaned_data['name'].title()


class StrainForm(ModelForm):

    class Meta:
        model = models.Strain
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        kwargs.pop('parent', None)
        super(StrainForm, self).__init__(*args, **kwargs)

    def clean_name(self):
        return self.cleaned_data['name'].title()


class EndpointSearchForm(forms.Form):

    endpoint_name = forms.CharField(required=False)

    tags = selectable.AutoCompleteSelectField(
        lookup_class=EffectTagLookup,
        label='Endpoint effect tag',
        required=False,
    )

    def clean(self):
        cleaned_data = super(EndpointSearchForm, self).clean()
        if ((cleaned_data['endpoint_name'] == u"") and
                (cleaned_data['tags'] == None)):
            raise forms.ValidationError("At least one search criteria should be specified.")
        return cleaned_data

    def get_search_results_div(self):
        return """
        <div>
        <b>Query details:</b><br>
        <ul>
            <li><b>Endpoint name: </b>{n}</li>
            <li><b>Tags: </b>{t}</li>
        </ul>
        </div>
        """.format(n=self.cleaned_data['endpoint_name'],
                   t=self.cleaned_data['tags'])

    def search(self, assessment):
        response = {'status': 'ok', 'endpoints': []}
        try:
            # build query
            query = {"assessment": assessment}
            if self.cleaned_data['endpoint_name'] is not "":
                query['name__icontains'] = self.cleaned_data['endpoint_name']
            if self.cleaned_data['tags'] is not None:
               query['effects__name'] = self.cleaned_data['tags']

            # filter endpoints
            endpoints = models.Endpoint.objects.filter(**query).distinct()

            # build response
            for endpoint in endpoints:
                response['endpoints'].append(endpoint.d_response(json_encode=False))
        except:
            response['status'] = 'An error occurred.'
        return json.dumps(response, cls=HAWCDjangoJSONEncoder)


class DoseUnitsForm(ModelForm):

    class Meta:
        model = models.DoseUnits
        fields = ("units", )

    def __init__(self, *args, **kwargs):
        kwargs.pop('parent', None)
        super(DoseUnitsForm, self).__init__(*args, **kwargs)
        self.fields['units'].widget = selectable.AutoCompleteWidget(
            lookup_class=lookups.DoseUnitsLookup,
            allow_new=True)
        for fld in self.fields.keys():
            self.fields[fld].widget.attrs['class'] = 'span12'


class EndpointFilterForm(forms.Form):

    studies = selectable.AutoCompleteSelectMultipleField(
        label='Study reference',
        lookup_class=AnimalStudyLookup,
        help_text="ex: Smith et al. 2010",
        required=False)

    cas = forms.CharField(
        label='CAS',
        widget=selectable.AutoCompleteWidget(lookups.ExperimentCASLookup),
        help_text="ex: 107-02-8",
        required=False)

    lifestage_exposed = forms.CharField(
        label='Lifestage exposed',
        widget=selectable.AutoCompleteWidget(lookups.AnimalGroupLifestageExposedLookup),
        help_text="ex: pup",
        required=False)

    lifestage_assessed = forms.CharField(
        label='Lifestage assessed',
        widget=selectable.AutoCompleteWidget(lookups.AnimalGroupLifestageAssessedLookup),
        help_text="ex: adult",
        required=False)

    species = selectable.AutoCompleteSelectField(
        label='Species',
        lookup_class=lookups.SpeciesLookup,
        help_text="ex: Mouse",
        required=False)

    strain = selectable.AutoCompleteSelectField(
        label='Strain',
        lookup_class=lookups.StrainLookup,
        help_text="ex: B6C3F1",
        required=False)

    sex = forms.MultipleChoiceField(
        choices=models.AnimalGroup.SEX_CHOICES,
        widget=forms.CheckboxSelectMultiple,
        initial=[c[0] for c in models.AnimalGroup.SEX_CHOICES],
        required=False)

    data_extracted = forms.ChoiceField(
        choices=((True, "Yes"), (False, "No"), (None, "All data")),
        initial=None,
        required=False)

    system = forms.CharField(
        label='System',
        widget=selectable.AutoCompleteWidget(lookups.EndpointSystemLookup),
        help_text="ex: endocrine",
        required=False)

    organ = forms.CharField(
        label='Organ',
        widget=selectable.AutoCompleteWidget(lookups.EndpointOrganLookup),
        help_text="ex: pituitary",
        required=False)

    effect = forms.CharField(
        label='Effect',
        widget=selectable.AutoCompleteWidget(lookups.EndpointEffectLookup),
        help_text="ex: alanine aminotransferase (ALT)",
        required=False)

    tags = forms.CharField(
        label='Tags',
        widget=selectable.AutoCompleteWidget(EffectTagLookup),
        help_text="ex: antibody response",
        required=False)

    dose_units = forms.ModelChoiceField(
       queryset=models.DoseUnits.objects.all(),
       required=False
    )

    paginate_by = forms.IntegerField(
        label='Items per page',
        min_value=1,
        initial=25,
        max_value=10000,
        required=False)

    def __init__(self, *args, **kwargs):
        assessment_id = kwargs.pop('assessment_id')
        super(EndpointFilterForm, self).__init__(*args, **kwargs)
        self.fields['studies'].widget.update_query_parameters(
            {'assessment': assessment_id})

        # disabled; dramatically slows-down page rendering;
        # involuntary context_switches
        self.helper = self.setHelper()

    def setHelper(self):

        # by default take-up the whole row-fluid
        for fld in self.fields.keys():
            widget = self.fields[fld].widget
            if type(widget) not in [forms.CheckboxInput, forms.CheckboxSelectMultiple]:
                widget.attrs['class'] = 'span12'

        helper = BaseFormHelper(self)

        helper.form_method = "GET"
        helper.form_class = None

        helper.add_fluid_row('studies', 4, "span3")
        helper.add_fluid_row('species', 4, "span3")
        helper.add_fluid_row('system', 4, "span3")
        helper.add_fluid_row('paginate_by', 4, "span3")

        helper.layout.append(
            cfb.FormActions(
                cfl.Submit('submit', 'Apply filters'),
            )
        )

        return helper

    def get_query(self):

        studies = self.cleaned_data.get('studies')
        cas = self.cleaned_data.get('cas')
        lifestage_exposed = self.cleaned_data.get('lifestage_exposed')
        lifestage_assessed = self.cleaned_data.get('lifestage_assessed')
        species = self.cleaned_data.get('species')
        strain = self.cleaned_data.get('strain')
        sex = self.cleaned_data.get('sex')
        data_extracted = self.cleaned_data.get('data_extracted')
        system = self.cleaned_data.get('system')
        organ = self.cleaned_data.get('organ')
        effect = self.cleaned_data.get('effect')
        tags = self.cleaned_data.get('tags')
        dose_units = self.cleaned_data.get('dose_units')

        query = Q()
        if studies:
            query &= Q(animal_group__experiment__study__in=studies)
        if cas:
            query &= Q(animal_group__experiment__cas__icontains=cas)
        if lifestage_exposed:
            query &= Q(animal_group__lifestage_exposed__icontains=lifestage_exposed)
        if lifestage_assessed:
            query &= Q(animal_group__lifestage_assessed__icontains=lifestage_assessed)
        if species:
            query &= Q(animal_group__species=species)
        if strain:
            query &= Q(animal_group__strain__name__icontains=strain.name)
        if sex:
            query &= Q(animal_group__sex__in=sex)
        if data_extracted:
            query &= Q(data_extracted=data_extracted == 'True')
        if system:
            query &= Q(system__icontains=system)
        if organ:
            query &= Q(organ__icontains=organ)
        if effect:
            query &= Q(effect__icontains=effect)
        if tags:
            query &= Q(effects__name__icontains=tags)
        if dose_units:
            query &= Q(animal_group__dosed_animals__doses__dose_units=dose_units)
        return query

    def get_dose_units_id(self):
        if hasattr(self, "cleaned_data") and self.cleaned_data.get('dose_units'):
            return self.cleaned_data.get('dose_units').id
