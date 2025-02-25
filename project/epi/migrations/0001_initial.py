# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.db.models.deletion
import django.core.validators


class Migration(migrations.Migration):

    dependencies = [
        ('animal', '0001_initial'),
        ('assessment', '0001_initial'),
        ('study', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='AssessedOutcome',
            fields=[
                ('baseendpoint_ptr', models.OneToOneField(parent_link=True, auto_created=True, primary_key=True, serialize=False, to='assessment.BaseEndpoint')),
                ('data_location', models.CharField(help_text=b'Details on where the data are found in the literature (ex: Figure 1, Table 2, etc.)', max_length=128, blank=True)),
                ('population_description', models.CharField(help_text=b'Detailed description of the population being studied for this outcome, which may be a subset of the entire study-population. For example, "US (national) NHANES 2003-2008, Hispanic children 6-18 years, \xe2\x99\x82\xe2\x99\x80 (n=797)"', max_length=128, blank=True)),
                ('diagnostic', models.PositiveSmallIntegerField(choices=[(0, b'not reported'), (1, b'medical professional or test'), (2, b'medical records'), (3, b'self-reported')])),
                ('diagnostic_description', models.TextField()),
                ('outcome_n', models.PositiveIntegerField(null=True, verbose_name=b'Outcome N', blank=True)),
                ('summary', models.TextField(help_text=b'Summarize main findings of outcome, or describe why no details are presented (for example, "no association (data not shown)")', blank=True)),
                ('prevalence_incidence', models.TextField(blank=True)),
                ('dose_response', models.PositiveSmallIntegerField(default=0, help_text=b'Was a dose-response trend observed?', verbose_name=b'Dose Response Trend', choices=[(0, b'not-applicable'), (1, b'monotonic'), (2, b'non-monotonic'), (3, b'no trend'), (4, b'not reported')])),
                ('dose_response_details', models.TextField(blank=True)),
                ('statistical_power', models.PositiveSmallIntegerField(default=0, help_text=b'Is the study sufficiently powered?', choices=[(0, b'not reported or calculated'), (1, b'appears to be adequately powered (sample size met)'), (2, b'somewhat underpowered (sample size is 75% to <100% of recommended)'), (3, b'underpowered (sample size is 50 to <75% required)'), (4, b'severely underpowered (sample size is <50% required)')])),
                ('statistical_power_details', models.TextField(blank=True)),
                ('main_finding_support', models.PositiveSmallIntegerField(default=1, help_text=b'Are the results supportive of the main-finding?', choices=[(3, b'not-reported'), (2, b'supportive'), (1, b'inconclusive'), (0, b'not-supportive')])),
                ('statistical_metric_description', models.TextField(help_text=b'Add additional text describing the statistical metric used, if needed.', blank=True)),
            ],
            options={
            },
            bases=('assessment.baseendpoint',),
        ),
        migrations.CreateModel(
            name='AssessedOutcomeGroup',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('n', models.PositiveIntegerField(help_text=b'Individuals in group where outcome was measured', null=True, blank=True)),
                ('estimate', models.FloatField(help_text=b'Central tendency estimate for group', null=True, blank=True)),
                ('se', models.FloatField(help_text=b'Standard error estimate for group', null=True, verbose_name=b'Standard Error (SE)', blank=True)),
                ('lower_ci', models.FloatField(help_text=b'Numerical value for lower-confidence interval', null=True, verbose_name=b'Lower CI', blank=True)),
                ('upper_ci', models.FloatField(help_text=b'Numerical value for upper-confidence interval', null=True, verbose_name=b'Upper CI', blank=True)),
                ('ci_units', models.FloatField(default=0.95, help_text=b'A 95% CI is written as 0.95.', null=True, verbose_name=b'Confidence Interval (CI)', blank=True)),
                ('p_value_qualifier', models.CharField(default=b'-', max_length=1, verbose_name=b'p-value qualifier', choices=[(b'<', b'<'), (b'=', b'='), (b'-', b'n.s.')])),
                ('p_value', models.FloatField(null=True, verbose_name=b'p-value', blank=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('last_updated', models.DateTimeField(auto_now=True)),
                ('assessed_outcome', models.ForeignKey(related_name='groups', to='epi.AssessedOutcome')),
            ],
            options={
                'ordering': ('exposure_group__exposure_group_id',),
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Ethnicity',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('ethnicity', models.CharField(max_length=1, choices=[(b'I', b'American Indian or Alaskan Native'), (b'A', b'Asian'), (b'B', b'Black or African American'), (b'H', b'Hispanic/Latino'), (b'P', b'Native American of Other Pacific Islander'), (b'M', b'Two or More Races'), (b'W', b'White'), (b'O', b'Other'), (b'U', b'Unknown/Unspecified')])),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('last_updated', models.DateTimeField(auto_now=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Exposure',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('inhalation', models.BooleanField(default=False)),
                ('dermal', models.BooleanField(default=False)),
                ('oral', models.BooleanField(default=False)),
                ('in_utero', models.BooleanField(default=False)),
                ('iv', models.BooleanField(default=False, verbose_name=b'Intravenous (IV)')),
                ('unknown_route', models.BooleanField(default=False)),
                ('exposure_form_definition', models.TextField(help_text=b'Name of exposure-route')),
                ('metric', models.TextField(verbose_name=b'Measurement Metric')),
                ('metric_description', models.TextField(verbose_name=b'Measurement Description')),
                ('analytical_method', models.TextField(help_text=b'Include details on the lab-techniques for exposure measurement in samples.')),
                ('control_description', models.TextField()),
                ('exposure_description', models.CharField(help_text=b'May be used to describe the exposure distribution, for example, "2.05 \xc2\xb5g/g creatinine (urine), geometric mean; 25th percentile = 1.18, 75th percentile = 3.33"', max_length=128, blank=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('last_updated', models.DateTimeField(auto_now=True)),
                ('metric_units', models.ForeignKey(to='animal.DoseUnits')),
            ],
            options={
                'ordering': ('exposure_form_definition',),
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='ExposureGroup',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('sex', models.CharField(max_length=1, choices=[(b'U', b'Not reported'), (b'M', b'Male'), (b'F', b'Female'), (b'B', b'Male and Female')])),
                ('fraction_male', models.FloatField(blank=True, help_text=b'Expects a value between 0 and 1, inclusive (leave blank if unknown)', null=True, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(1)])),
                ('fraction_male_calculated', models.BooleanField(default=False, help_text=b'Was the fraction-male value calculated/estimated from literature?')),
                ('age_mean', models.FloatField(null=True, verbose_name=b'Age central estimate', blank=True)),
                ('age_mean_type', models.PositiveSmallIntegerField(default=0, verbose_name=b'Age central estimate type', choices=[(0, None), (1, b'mean'), (2, b'geometric mean'), (3, b'median')])),
                ('age_calculated', models.BooleanField(default=False, help_text=b'Were age values calculated/estimated from literature?')),
                ('age_description', models.CharField(help_text=b'Age description if numeric ages do not make sense for this study-population (ex: longitudinal studies)', max_length=128, blank=True)),
                ('age_sd', models.FloatField(null=True, verbose_name=b'Age variance', blank=True)),
                ('age_sd_type', models.PositiveSmallIntegerField(default=0, verbose_name=b'Age variance type', choices=[(0, None), (1, b'SD'), (2, b'SEM')])),
                ('age_lower', models.FloatField(null=True, blank=True)),
                ('age_lower_type', models.PositiveSmallIntegerField(default=0, choices=[(0, None), (1, b'lower limit')])),
                ('age_upper', models.FloatField(null=True, blank=True)),
                ('age_upper_type', models.PositiveSmallIntegerField(default=0, choices=[(0, None), (1, b'upper limit')])),
                ('n', models.PositiveIntegerField(null=True, blank=True)),
                ('starting_n', models.PositiveIntegerField(null=True, blank=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('last_updated', models.DateTimeField(auto_now=True)),
                ('description', models.CharField(max_length=256)),
                ('exposure_numeric', models.FloatField(help_text=b'Should be an exposure-value used for sorting', null=True, verbose_name=b'Low exposure value (sorting)', blank=True)),
                ('comparative_name', models.CharField(help_text=b'Should include effect-group and comparative group, for example "1.5-2.5(Q2) vs \xe2\x89\xa41.5(Q1)", or if only one group is available, "4.8\xc2\xb10.2 (mean\xc2\xb1SEM)"', max_length=64, verbose_name=b'Comparative Name', blank=True)),
                ('exposure_group_id', models.PositiveSmallIntegerField()),
                ('exposure_n', models.PositiveSmallIntegerField(help_text=b'Final N used for exposure group', null=True, blank=True)),
                ('ethnicity', models.ManyToManyField(to='epi.Ethnicity', blank=True)),
                ('exposure', models.ForeignKey(related_name='groups', to='epi.Exposure')),
            ],
            options={
                'ordering': ('exposure_group_id',),
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Factor',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('description', models.TextField()),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('last_updated', models.DateTimeField(auto_now=True)),
                ('assessment', models.ForeignKey(to='assessment.Assessment')),
            ],
            options={
                'ordering': ('description',),
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='MetaProtocol',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=128, verbose_name=b'Protocol name')),
                ('protocol_type', models.PositiveSmallIntegerField(default=0, choices=[(0, b'Meta-analysis'), (1, b'Pooled-analysis')])),
                ('lit_search_strategy', models.PositiveSmallIntegerField(default=0, verbose_name=b'Literature search strategy', choices=[(0, b'Systematic'), (1, b'Other')])),
                ('lit_search_notes', models.TextField(verbose_name=b'Literature search notes', blank=True)),
                ('lit_search_start_date', models.DateField(null=True, verbose_name=b'Literature search start-date', blank=True)),
                ('lit_search_end_date', models.DateField(null=True, verbose_name=b'Literature search end-date', blank=True)),
                ('total_references', models.PositiveIntegerField(help_text=b'References identified through initial literature-search before application of inclusion/exclusion criteria', null=True, verbose_name=b'Total number of references found', blank=True)),
                ('total_studies_identified', models.PositiveIntegerField(help_text=b'Total references identified for inclusion after application of literature review and screening criteria', verbose_name=b'Total number of studies identified')),
                ('notes', models.TextField(blank=True)),
            ],
            options={
                'ordering': ('name',),
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='MetaResult',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('label', models.CharField(max_length=128)),
                ('data_location', models.CharField(help_text=b'Details on where the data are found in the literature (ex: Figure 1, Table 2, etc.)', max_length=128, blank=True)),
                ('health_outcome', models.CharField(max_length=128)),
                ('health_outcome_notes', models.TextField(blank=True)),
                ('exposure_name', models.CharField(max_length=128)),
                ('exposure_details', models.TextField(blank=True)),
                ('number_studies', models.PositiveSmallIntegerField()),
                ('statistical_notes', models.TextField(blank=True)),
                ('n', models.PositiveIntegerField(help_text=b'Number of individuals included from all analyses')),
                ('estimate', models.FloatField()),
                ('lower_ci', models.FloatField(help_text=b'Numerical value for lower-confidence interval', verbose_name=b'Lower CI')),
                ('upper_ci', models.FloatField(help_text=b'Numerical value for upper-confidence interval', verbose_name=b'Upper CI')),
                ('ci_units', models.FloatField(default=0.95, help_text=b'A 95% CI is written as 0.95.', null=True, verbose_name=b'Confidence Interval (CI)', blank=True)),
                ('heterogeneity', models.CharField(max_length=256, blank=True)),
                ('notes', models.TextField(blank=True)),
                ('adjustment_factors', models.ManyToManyField(help_text=b'All factors which were included in final model', related_name='meta_adjustments', null=True, to='epi.Factor', blank=True)),
                ('protocol', models.ForeignKey(related_name='results', to='epi.MetaProtocol')),
            ],
            options={
                'ordering': ('label',),
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='SingleResult',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('exposure_name', models.CharField(help_text=b'Enter a descriptive-name for the single study result (e.g., "Smith et al. 2000, obese-males")', max_length=128)),
                ('weight', models.FloatField(blank=True, help_text=b'For meta-analysis, enter the fraction-weight assigned for each result (leave-blank for pooled analyses)', null=True, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(1)])),
                ('n', models.PositiveIntegerField(help_text=b'Enter the number of observations for this result', null=True, blank=True)),
                ('estimate', models.FloatField(help_text=b'Enter the numerical risk-estimate presented for this result', null=True, blank=True)),
                ('lower_ci', models.FloatField(help_text=b'Numerical value for lower-confidence interval', null=True, verbose_name=b'Lower CI', blank=True)),
                ('upper_ci', models.FloatField(help_text=b'Numerical value for upper-confidence interval', null=True, verbose_name=b'Upper CI', blank=True)),
                ('ci_units', models.FloatField(default=0.95, help_text=b'A 95% CI is written as 0.95.', null=True, verbose_name=b'Confidence Interval (CI)', blank=True)),
                ('notes', models.TextField(blank=True)),
                ('meta_result', models.ForeignKey(related_name='single_results', to='epi.MetaResult')),
                ('outcome_group', models.ForeignKey(related_name='single_results', blank=True, to='epi.AssessedOutcomeGroup', null=True)),
                ('study', models.ForeignKey(related_name='single_results', blank=True, to='study.Study', null=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='StatisticalMetric',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('metric', models.CharField(unique=True, max_length=128)),
                ('abbreviation', models.CharField(max_length=32)),
                ('isLog', models.BooleanField(default=True, help_text=b'When  plotting, use a log base 10 scale', verbose_name=b'Log-results')),
                ('order', models.PositiveSmallIntegerField(help_text=b'Order as they appear in option-list')),
            ],
            options={
                'ordering': ('order',),
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='StudyCriteria',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('description', models.TextField()),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('last_updated', models.DateTimeField(auto_now=True)),
                ('assessment', models.ForeignKey(to='assessment.Assessment')),
            ],
            options={
                'ordering': ('description',),
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='StudyPopulation',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('sex', models.CharField(max_length=1, choices=[(b'U', b'Not reported'), (b'M', b'Male'), (b'F', b'Female'), (b'B', b'Male and Female')])),
                ('fraction_male', models.FloatField(blank=True, help_text=b'Expects a value between 0 and 1, inclusive (leave blank if unknown)', null=True, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(1)])),
                ('fraction_male_calculated', models.BooleanField(default=False, help_text=b'Was the fraction-male value calculated/estimated from literature?')),
                ('age_mean', models.FloatField(null=True, verbose_name=b'Age central estimate', blank=True)),
                ('age_mean_type', models.PositiveSmallIntegerField(default=0, verbose_name=b'Age central estimate type', choices=[(0, None), (1, b'mean'), (2, b'geometric mean'), (3, b'median')])),
                ('age_calculated', models.BooleanField(default=False, help_text=b'Were age values calculated/estimated from literature?')),
                ('age_description', models.CharField(help_text=b'Age description if numeric ages do not make sense for this study-population (ex: longitudinal studies)', max_length=128, blank=True)),
                ('age_sd', models.FloatField(null=True, verbose_name=b'Age variance', blank=True)),
                ('age_sd_type', models.PositiveSmallIntegerField(default=0, verbose_name=b'Age variance type', choices=[(0, None), (1, b'SD'), (2, b'SEM')])),
                ('age_lower', models.FloatField(null=True, blank=True)),
                ('age_lower_type', models.PositiveSmallIntegerField(default=0, choices=[(0, None), (1, b'lower limit')])),
                ('age_upper', models.FloatField(null=True, blank=True)),
                ('age_upper_type', models.PositiveSmallIntegerField(default=0, choices=[(0, None), (1, b'upper limit')])),
                ('n', models.PositiveIntegerField(null=True, blank=True)),
                ('starting_n', models.PositiveIntegerField(null=True, blank=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('last_updated', models.DateTimeField(auto_now=True)),
                ('name', models.CharField(max_length=256)),
                ('design', models.CharField(max_length=2, choices=[(b'CC', b'Case-control'), (b'CS', b'Cross-sectional'), (b'CP', b'Prospective'), (b'RT', b'Retrospective'), (b'CT', b'Controlled trial'), (b'SE', b'Case-series'), (b'CR', b'Case-report')])),
                ('country', models.CharField(max_length=2, choices=[(b'AF', 'Afghanistan'), (b'AX', '\xc5land Islands'), (b'AL', 'Albania'), (b'DZ', 'Algeria'), (b'AS', 'American Samoa'), (b'AD', 'Andorra'), (b'AO', 'Angola'), (b'AI', 'Anguilla'), (b'AQ', 'Antarctica'), (b'AG', 'Antigua And Barbuda'), (b'AR', 'Argentina'), (b'AM', 'Armenia'), (b'AW', 'Aruba'), (b'AU', 'Australia'), (b'AT', 'Austria'), (b'AZ', 'Azerbaijan'), (b'BS', 'Bahamas'), (b'BH', 'Bahrain'), (b'BD', 'Bangladesh'), (b'BB', 'Barbados'), (b'BY', 'Belarus'), (b'BE', 'Belgium'), (b'BZ', 'Belize'), (b'BJ', 'Benin'), (b'BM', 'Bermuda'), (b'BT', 'Bhutan'), (b'BO', 'Bolivia, Plurinational State Of'), (b'BQ', 'Bonaire, Sint Eustatius And Saba'), (b'BA', 'Bosnia And Herzegovina'), (b'BW', 'Botswana'), (b'BV', 'Bouvet Island'), (b'BR', 'Brazil'), (b'IO', 'British Indian Ocean Territory'), (b'BN', 'Brunei Darussalam'), (b'BG', 'Bulgaria'), (b'BF', 'Burkina Faso'), (b'BI', 'Burundi'), (b'KH', 'Cambodia'), (b'CM', 'Cameroon'), (b'CA', 'Canada'), (b'CV', 'Cape Verde'), (b'KY', 'Cayman Islands'), (b'CF', 'Central African Republic'), (b'TD', 'Chad'), (b'CL', 'Chile'), (b'CN', 'China'), (b'CX', 'Christmas Island'), (b'CC', 'Cocos (Keeling) Islands'), (b'CO', 'Colombia'), (b'KM', 'Comoros'), (b'CG', 'Congo'), (b'CD', 'Congo, The Democratic Republic Of The'), (b'CK', 'Cook Islands'), (b'CR', 'Costa Rica'), (b'CI', "C\xf4te D'Ivoire"), (b'HR', 'Croatia'), (b'CU', 'Cuba'), (b'CW', 'Cura\xe7ao'), (b'CY', 'Cyprus'), (b'CZ', 'Czech Republic'), (b'DK', 'Denmark'), (b'DJ', 'Djibouti'), (b'DM', 'Dominica'), (b'DO', 'Dominican Republic'), (b'EC', 'Ecuador'), (b'EG', 'Egypt'), (b'SV', 'El Salvador'), (b'GQ', 'Equatorial Guinea'), (b'ER', 'Eritrea'), (b'EE', 'Estonia'), (b'ET', 'Ethiopia'), (b'FK', 'Falkland Islands (Malvinas)'), (b'FO', 'Faroe Islands'), (b'FJ', 'Fiji'), (b'FI', 'Finland'), (b'FR', 'France'), (b'GF', 'French Guiana'), (b'PF', 'French Polynesia'), (b'TF', 'French Southern Territories'), (b'GA', 'Gabon'), (b'GM', 'Gambia'), (b'GE', 'Georgia'), (b'DE', 'Germany'), (b'GH', 'Ghana'), (b'GI', 'Gibraltar'), (b'GR', 'Greece'), (b'GL', 'Greenland'), (b'GD', 'Grenada'), (b'GP', 'Guadeloupe'), (b'GU', 'Guam'), (b'GT', 'Guatemala'), (b'GG', 'Guernsey'), (b'GN', 'Guinea'), (b'GW', 'Guinea-Bissau'), (b'GY', 'Guyana'), (b'HT', 'Haiti'), (b'HM', 'Heard Island And Mcdonald Islands'), (b'VA', 'Holy See (Vatican City State)'), (b'HN', 'Honduras'), (b'HK', 'Hong Kong'), (b'HU', 'Hungary'), (b'IS', 'Iceland'), (b'IN', 'India'), (b'ID', 'Indonesia'), (b'IR', 'Iran, Islamic Republic Of'), (b'IQ', 'Iraq'), (b'IE', 'Ireland'), (b'IM', 'Isle Of Man'), (b'IL', 'Israel'), (b'IT', 'Italy'), (b'JM', 'Jamaica'), (b'JP', 'Japan'), (b'JE', 'Jersey'), (b'JO', 'Jordan'), (b'KZ', 'Kazakhstan'), (b'KE', 'Kenya'), (b'KI', 'Kiribati'), (b'KP', "Korea, Democratic People's Republic Of"), (b'KR', 'Korea, Republic Of'), (b'KW', 'Kuwait'), (b'KG', 'Kyrgyzstan'), (b'LA', "Lao People's Democratic Republic"), (b'LV', 'Latvia'), (b'LB', 'Lebanon'), (b'LS', 'Lesotho'), (b'LR', 'Liberia'), (b'LY', 'Libya'), (b'LI', 'Liechtenstein'), (b'LT', 'Lithuania'), (b'LU', 'Luxembourg'), (b'MO', 'Macao'), (b'MK', 'Macedonia, The Former Yugoslav Republic Of'), (b'MG', 'Madagascar'), (b'MW', 'Malawi'), (b'MY', 'Malaysia'), (b'MV', 'Maldives'), (b'ML', 'Mali'), (b'MT', 'Malta'), (b'MH', 'Marshall Islands'), (b'MQ', 'Martinique'), (b'MR', 'Mauritania'), (b'MU', 'Mauritius'), (b'YT', 'Mayotte'), (b'MX', 'Mexico'), (b'FM', 'Micronesia, Federated States Of'), (b'MD', 'Moldova, Republic Of'), (b'MC', 'Monaco'), (b'MN', 'Mongolia'), (b'ME', 'Montenegro'), (b'MS', 'Montserrat'), (b'MA', 'Morocco'), (b'MZ', 'Mozambique'), (b'MM', 'Myanmar'), (b'NA', 'Namibia'), (b'NR', 'Nauru'), (b'NP', 'Nepal'), (b'NL', 'Netherlands'), (b'NC', 'New Caledonia'), (b'NZ', 'New Zealand'), (b'NI', 'Nicaragua'), (b'NE', 'Niger'), (b'NG', 'Nigeria'), (b'NU', 'Niue'), (b'NF', 'Norfolk Island'), (b'MP', 'Northern Mariana Islands'), (b'NO', 'Norway'), (b'OM', 'Oman'), (b'PK', 'Pakistan'), (b'PW', 'Palau'), (b'PS', 'Palestine, State Of'), (b'PA', 'Panama'), (b'PG', 'Papua New Guinea'), (b'PY', 'Paraguay'), (b'PE', 'Peru'), (b'PH', 'Philippines'), (b'PN', 'Pitcairn'), (b'PL', 'Poland'), (b'PT', 'Portugal'), (b'PR', 'Puerto Rico'), (b'QA', 'Qatar'), (b'RE', 'R\xe9union'), (b'RO', 'Romania'), (b'RU', 'Russian Federation'), (b'RW', 'Rwanda'), (b'BL', 'Saint Barth\xe9lemy'), (b'SH', 'Saint Helena, Ascension And Tristan Da Cunha'), (b'KN', 'Saint Kitts And Nevis'), (b'LC', 'Saint Lucia'), (b'MF', 'Saint Martin (French Part)'), (b'PM', 'Saint Pierre And Miquelon'), (b'VC', 'Saint Vincent And The Grenadines'), (b'WS', 'Samoa'), (b'SM', 'San Marino'), (b'ST', 'Sao Tome And Principe'), (b'SA', 'Saudi Arabia'), (b'SN', 'Senegal'), (b'RS', 'Serbia'), (b'SC', 'Seychelles'), (b'SL', 'Sierra Leone'), (b'SG', 'Singapore'), (b'SX', 'Sint Maarten (Dutch Part)'), (b'SK', 'Slovakia'), (b'SI', 'Slovenia'), (b'SB', 'Solomon Islands'), (b'SO', 'Somalia'), (b'ZA', 'South Africa'), (b'GS', 'South Georgia And The South Sandwich Islands'), (b'SS', 'South Sudan'), (b'ES', 'Spain'), (b'LK', 'Sri Lanka'), (b'SD', 'Sudan'), (b'SR', 'Suriname'), (b'SJ', 'Svalbard And Jan Mayen'), (b'SZ', 'Swaziland'), (b'SE', 'Sweden'), (b'CH', 'Switzerland'), (b'SY', 'Syrian Arab Republic'), (b'TW', 'Taiwan, Province Of China'), (b'TJ', 'Tajikistan'), (b'TZ', 'Tanzania, United Republic Of'), (b'TH', 'Thailand'), (b'TL', 'Timor-Leste'), (b'TG', 'Togo'), (b'TK', 'Tokelau'), (b'TO', 'Tonga'), (b'TT', 'Trinidad And Tobago'), (b'TN', 'Tunisia'), (b'TR', 'Turkey'), (b'TM', 'Turkmenistan'), (b'TC', 'Turks And Caicos Islands'), (b'TV', 'Tuvalu'), (b'UG', 'Uganda'), (b'UA', 'Ukraine'), (b'AE', 'United Arab Emirates'), (b'GB', 'United Kingdom'), (b'US', 'United States'), (b'UM', 'United States Minor Outlying Islands'), (b'UY', 'Uruguay'), (b'UZ', 'Uzbekistan'), (b'VU', 'Vanuatu'), (b'VE', 'Venezuela, Bolivarian Republic Of'), (b'VN', 'Viet Nam'), (b'VG', 'Virgin Islands, British'), (b'VI', 'Virgin Islands, U.S.'), (b'WF', 'Wallis And Futuna'), (b'EH', 'Western Sahara'), (b'YE', 'Yemen'), (b'ZM', 'Zambia'), (b'ZW', 'Zimbabwe')])),
                ('region', models.CharField(max_length=128, blank=True)),
                ('state', models.CharField(max_length=128, blank=True)),
                ('confounding_criteria', models.ManyToManyField(related_name='confounding_criteria', null=True, to='epi.StudyCriteria', blank=True)),
                ('ethnicity', models.ManyToManyField(to='epi.Ethnicity', blank=True)),
                ('exclusion_criteria', models.ManyToManyField(related_name='exclusion_criteria', null=True, to='epi.StudyCriteria', blank=True)),
                ('inclusion_criteria', models.ManyToManyField(related_name='inclusion_criteria', null=True, to='epi.StudyCriteria', blank=True)),
                ('study', models.ForeignKey(related_name='study_populations', to='study.Study')),
            ],
            options={
                'ordering': ('name',),
            },
            bases=(models.Model,),
        ),
        migrations.AlterUniqueTogether(
            name='studycriteria',
            unique_together=set([('assessment', 'description')]),
        ),
        migrations.AddField(
            model_name='metaresult',
            name='statistical_metric',
            field=models.ForeignKey(to='epi.StatisticalMetric'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='metaprotocol',
            name='exclusion_criteria',
            field=models.ManyToManyField(related_name='meta_exclusion_criteria', null=True, to='epi.StudyCriteria', blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='metaprotocol',
            name='inclusion_criteria',
            field=models.ManyToManyField(related_name='meta_inclusion_criteria', null=True, to='epi.StudyCriteria', blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='metaprotocol',
            name='study',
            field=models.ForeignKey(related_name='meta_protocols', to='study.Study'),
            preserve_default=True,
        ),
        migrations.AlterUniqueTogether(
            name='factor',
            unique_together=set([('assessment', 'description')]),
        ),
        migrations.AddField(
            model_name='exposure',
            name='study_population',
            field=models.ForeignKey(related_name='exposures', to='epi.StudyPopulation'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='assessedoutcomegroup',
            name='exposure_group',
            field=models.ForeignKey(help_text=b'Exposure-group related to this assessed outcome group', to='epi.ExposureGroup'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='assessedoutcome',
            name='adjustment_factors',
            field=models.ManyToManyField(help_text=b'All factors which were included in final model', related_name='adjustments', null=True, to='epi.Factor', blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='assessedoutcome',
            name='confounders_considered',
            field=models.ManyToManyField(related_name='confounders', to='epi.Factor', blank=True, help_text=b'All factors which were examined (including those which were included in final model)', null=True, verbose_name=b'Adjustment factors considered'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='assessedoutcome',
            name='exposure',
            field=models.ForeignKey(related_name='outcomes', to='epi.Exposure'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='assessedoutcome',
            name='main_finding',
            field=models.ForeignKey(on_delete=django.db.models.deletion.SET_NULL, blank=True, to='epi.ExposureGroup', help_text=b'When a study did not report a statistically significant association use the highest exposure group compared with the referent group (e.g., fourth quartile vs. first quartile). When a study reports a statistically significant association use the lowest exposure group with a statistically significant association (e.g., third quartile vs. first quartile). When associations were non-monotonic in nature, select main findings on a case-by-case basis.', null=True, verbose_name=b'Main finding'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='assessedoutcome',
            name='statistical_metric',
            field=models.ForeignKey(to='epi.StatisticalMetric'),
            preserve_default=True,
        ),
    ]
