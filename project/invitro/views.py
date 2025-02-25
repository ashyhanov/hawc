from assessment.models import Assessment
from utils.views import GenerateReport, BaseList, BaseDetail

from . import models, exports


class ExperimentDetail(BaseDetail):
    model = models.IVExperiment


class EndpointDetail(BaseDetail):
    model = models.IVEndpoint


class EndpointsList(BaseList):
    parent_model = Assessment
    model = models.IVEndpoint

    def get_paginate_by(self, qs):
        val = 25
        try:
            val = int(self.request.GET.get('paginate_by', val))
        except ValueError:
            pass
        return val

    def get_queryset(self):
        filters = {"assessment": self.assessment}
        perms = super(EndpointsList, self).get_obj_perms()
        if not perms['edit']:
            filters["experiment__study__published"] = True
        return self.model.objects.filter(**filters).order_by('name')


class EndpointsFullExport(EndpointsList):
    parent_model = Assessment
    model = models.IVEndpoint

    def get(self, request, *args, **kwargs):
        self.object_list = self.get_queryset()
        export_format = request.GET.get("output", "excel")
        exporter = exports.IVEndpointFlatDataPivot(
                self.object_list,
                export_format=export_format,
                filename='{}-invitro'.format(self.assessment))
        return exporter.build_response()


class EndpointsReport(GenerateReport):
    parent_model = Assessment
    model = models.IVEndpoint
    report_type = 5

    def get_queryset(self):
        filters = {"assessment": self.assessment}
        perms = super(EndpointsReport, self).get_obj_perms()
        if not perms['edit'] or self.onlyPublished:
            filters["experiment__study__published"] = True
        return self.model.objects.filter(**filters)

    def get_filename(self):
        return "in-vitro.docx"

    def get_context(self, queryset):
        return self.model.get_docx_template_context(queryset)
