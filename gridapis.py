from flask import Blueprint, Flask, request, session, g, redirect, url_for, \
     abort, render_template, flash, Markup
from boto.dynamodb2 import regions
from boto.dynamodb2.layer1 import DynamoDBConnection
from boto.regioninfo import RegionInfo
from boto.dynamodb2 import connect_to_region
from boto.dynamodb2.items import Item
from boto.dynamodb2.fields import HashKey
from boto.dynamodb2.table import Table
import boto
import uuid
import json
import os

grids_api = Blueprint('grids_api', __name__)

conn = DynamoDBConnection(
            region=RegionInfo(name='us-west-2',
                              endpoint='dynamodb.us-west-2.amazonaws.com'),
)
entities = Table('entities', connection=conn)

@grids_api.route('/viewgrid/<ename>', methods=['GET'])
def viewgrid(ename):
    curentity = entities.get_item(entityname=ename)
    gridjson = curentity['gridjson']
    gridinfo = json.loads(gridjson)
    rownumbers = [gridbox['row'] for gridbox in gridinfo]
    numrows = max(rownumbers)
    displaylist = []
    for rownumber in range(1, numrows + 1):
        rowboxes = [gridbox for gridbox in gridinfo if gridbox['row'] == rownumber]
        displaylist.append(rowboxes)
    return render_template('viewgrid.html', gridjson = gridjson, displaylist = displaylist)
