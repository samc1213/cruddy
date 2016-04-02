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

gridheight = 15 # pixels
# grid width (column size) is defined to be 1/6 of the width of the available space

@grids_api.route('/viewgrid/<ename>', methods=['GET'])
def viewgrid(ename):
    curentity = entities.get_item(entityname=ename)
    gridjson = curentity['gridjson']
    gridinfo = json.loads(gridjson)
    entitytable = Table(ename, connection=conn)
    dictlist = [dict(inst) for inst in entitytable.scan()]
    rownumbers = [gridbox['row'] for gridbox in gridinfo]
    numrows = max(rownumbers)
    eboxheight = 0
    for gb in gridinfo:
        if gb['row'] == numrows:
            neweboxheight = numrows * gridheight + (gb['size_y']-1) * gridheight
            if neweboxheight > eboxheight:
                eboxheight = neweboxheight
    # for rownumber in range(1, numrows + 1):
    #     rowboxes = [gridbox for gridbox in gridinfo if gridbox['row'] == rownumber]
    #     displaylist.append(rowboxes)
    displaylists = []
    for d in dictlist:
        displaylist = []
        for box in gridinfo:
            newbox = {}
            newbox['widthpercentage'] = (1/6.0) * box['size_x'] * 100
            newbox['heightinpx'] = gridheight * box['size_y']
            newbox['topamountpx'] = (box['row'] - 1) * gridheight
            newbox['leftamountpercent'] = (box['col'] - 1) * (1/6.0) * 100
            fieldnamenum = box['fieldnamenumber']
            newbox['value'] = d[fieldnamenum]
            displaylist.append(newbox)
        displaylists.append(displaylist)
    test = 'hi'
    return render_template('viewgrid.html', gridjson = gridjson, displaylists = displaylists, dictlist = dictlist, entityboxheight = eboxheight, numrows = numrows, gridinfo = gridinfo)
