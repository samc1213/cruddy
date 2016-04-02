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
import simplejson
from actionapis import runactions

BUCKET_NAME = 'cruddybucket'

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
    curentityjson = simplejson.dumps(dict(curentity))
    fieldinfo = json.loads(curentity['fields'])
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
            fieldnamenum = box['fieldnamenumber']

            if (len(fieldnamenum.split('-')) > 1 and fieldnamenum.split('-')[0][0:6] != "action"):
                fieldna = "fieldname"
                for fname, fval in fieldinfo.iteritems():
                    if fval == fieldnamenum.split('-')[0]:
                        fieldna += fname[-1]
                newbox['widthpercentage'] = (1/6.0) * box['size_x'] * 100
                newbox['heightinpx'] = gridheight * box['size_y']
                newbox['topamountpx'] = (box['row'] - 1) * gridheight
                newbox['leftamountpercent'] = (box['col'] - 1) * (1/6.0) * 100

                childentitytable = Table(fieldnamenum.split('-')[0], connection = conn)
                newbox['value'] = childentitytable.get_item(uuid = d[fieldna])[fieldnamenum.split('-')[1]]
                # newbox['value'] = d[fieldnamenum.split('-')[1]]
                # newbox['value'] = d[fieldna]
                newbox['fieldnum'] = fieldnamenum[9:]
                displaylist.append(newbox)
            elif fieldnamenum[0:10] != 'actionname':
                # this means its a fieldname
                newbox['widthpercentage'] = (1/6.0) * box['size_x'] * 100
                newbox['heightinpx'] = gridheight * box['size_y']
                newbox['topamountpx'] = (box['row'] - 1) * gridheight
                newbox['leftamountpercent'] = (box['col'] - 1) * (1/6.0) * 100
                fieldnum = fieldnamenum[9:]
                fieldtype = fieldinfo['fieldtype' + fieldnum]
                if fieldtype == 'file':
                    s3link = 'https://s3.amazonaws.com/' + BUCKET_NAME + '/' + ename + '/' + d[fieldnamenum]
                    fieldnamemkup = Markup('<a href="' + s3link + '" download>' + d[fieldnamenum] + '</a>')
                    newbox['value'] = fieldnamemkup
                else:
                    newbox['value'] = d[fieldnamenum]
                newbox['fieldnum'] = fieldnum
                displaylist.append(newbox)
            else:
                newbox['widthpercentage'] = (1/6.0) * box['size_x'] * 100
                newbox['heightinpx'] = gridheight * box['size_y']
                newbox['topamountpx'] = (box['row'] - 1) * gridheight
                newbox['leftamountpercent'] = (box['col'] - 1) * (1/6.0) * 100
                btntext = runactions(fieldinfo[fieldnamenum], '/doaction/' + ename, fieldnamenum[10:].split('-')[0], fieldinfo['actionqualifier' + fieldnamenum[10:]], d['uuid'])
                newbox['value'] = btntext
                newbox['fieldnum'] = fieldnamenum[10:]
                displaylist.append(newbox)
        displaylists.append({'fieldinfo': displaylist, 'uuid': d['uuid']})
    optionslist = []
    for fname, val in fieldinfo.iteritems():
        newoption = {}
        if fname[0:9] == 'fieldname':
            newoption['val'] = fname
            newoption['text'] = val
            optionslist.append(newoption)
    test = 'hi'
    return render_template('viewgrid.html', gridjson = gridjson, displaylists = displaylists, dictlist = dictlist, entityboxheight = eboxheight, numrows = numrows, gridinfo = gridinfo, curentityjson=curentityjson, optionslist=optionslist)
