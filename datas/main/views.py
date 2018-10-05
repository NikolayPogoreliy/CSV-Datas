from django.shortcuts import render
from functools import reduce
import math as mt
import json as js
import collections as cl
from django.db.models import Min, Max

from django.views.generic import TemplateView
from .models import Data

# Create your views here.


class HomeView(TemplateView):
    template_name = "base.html"

    def get(self, request):
        datas = Data.objects.all()
        if not datas:
            return render(request=request, template_name="error.html")
        v_min = mt.floor(list(datas.aggregate(Min('value')).values())[0])
        v_max = mt.ceil(list(datas.aggregate(Max('value')).values())[0])
        result = dict()
        result['total'] = dict(cl.Counter((x.entity for x in datas)))
        result['range'] = [v_min, v_max]
        result['values'] = []
        for i in range(v_min, v_max):
            rng = datas.filter(value__range=(i, i + 1)).values('entity')
            res = dict(cl.Counter((x['entity'] for x in rng)))
            summ = reduce(lambda a, x: a+x, res.values(), 0)
            res['total'] = summ
            res['time'] = i
            result['values'].append(res)
        return render(request=request, template_name="base.html", context={"result": js.dumps(result)})



