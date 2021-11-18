from django import forms

from django.core.exceptions import ValidationError
from django.utils.translation import ugettext_lazy as _
import datetime #for checking renewal date range

class DateForm(forms.Form):
    begin_date=forms.DateField(help_text="請輸入起始日期")
    end_date=forms.DateField(help_text="請輸入結束日期")

    def clean_renewal_date(self):
        b_data=self.cleaned_data['begin_date']
        e_data=self.cleaned_data['end_date']

        return b_data,e_data