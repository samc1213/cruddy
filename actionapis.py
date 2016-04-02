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

actions_api = Blueprint('actions_api', __name__)

conn = DynamoDBConnection(
            region=RegionInfo(name='us-west-2',
                              endpoint='dynamodb.us-west-2.amazonaws.com'),
)
entities = Table('entities', connection=conn)


@actions_api.route('/doaction/<ename>', methods=['GET', 'POST'])
def doaction(ename):
    if request.method == 'POST':
        uuid = request.form['uuid']
        fieldname = request.form['fieldname']
        action = str(request.form['actionname'])
        entityname = ename
        entitytable = Table(entityname, connection = conn)
        entityinstancetoact = entitytable.get_item(
            uuid=uuid
        )
        if (action == "add" or action == "subtract"):
            oldval = int(entityinstancetoact[fieldname])
            valtoincrement = request.form['incrementvalue']
            # application.debug.logger(valtoincrement)
            # application.debug.logger(oldval)
            newval = oldval + int(valtoincrement)
            entityinstancetoact[fieldname] = newval
            entityinstancetoact.save()
        # if (action == "")

        return ('', 204)
        # return redirect(url_for('seemylist', ename = ename))

@actions_api.route('/editendpoint', methods=['POST'])
def editendpoint():
    ename = request.form['entityname']
    uuid = request.form['uuid']
    texttochange = request.form['value']
    fieldnumber = request.form['fieldnumber']
    entitytable = Table(ename, connection=conn)
    entityinstance = entitytable.get_item(uuid=uuid)
    entityinstance['fieldname' + fieldnumber] = texttochange
    entityinstance.save()
    return entityinstance['fieldname' + fieldnumber]


def runactions(actionname, acc, fieldnumber, actionqualifier, uuid):
    if actionname == 'add':
        # application.logger.debug('WOOADD!');
        buttontext =   '<form style="height:100%; width:100%;" action="' + acc + '" method="post"> <input type="hidden" name="uuid" id="uuidid" value="' + uuid + '"> <input type="hidden" name ="actionname" value = "'+ actionname+'" > <input type="hidden" name="fieldname" id="fieldnameid" value="' + 'fieldname' + fieldnumber + '"><input type="hidden" name="incrementvalue" value="' + actionqualifier +'"> <button type="submit" class = "btn btn-default" style="height:100%; width:100%;"> Add!</button> </form>'
        return Markup(buttontext)
    if actionname == 'subtract':
        # application.logger.debug('WOOADD!');
        buttontext =   '<form style="height:100%; width:100%;" action="' + acc + '" method="post"> <input type="hidden" name="uuid" id="uuidid" value="' + uuid + '"> <input type="hidden" name ="actionname" value = "'+ actionname+'" > <input type="hidden" name="fieldname" id="fieldnameid" value="' + 'fieldname' + fieldnumber + '"><input type="hidden" name="incrementvalue" value="-' + actionqualifier +'"> <button type="submit" class = "btn btn-default" style="height:100%; width:100%;"> Subtract!</button> </form>'
        return Markup(buttontext)
    if actionname == 'edit':
        buttontext =   '<form class = "editform" style="height:100%; width:100%;"> <input type="hidden" name="uuid" id="uuidid" value="' + uuid + '"> <input type="hidden" name ="actionname" value = "'+ actionname+'" > <input type="hidden" name="fieldname" id="fieldnameid" value="' + 'fieldname' + fieldnumber + '"> <button type="submit" class = "btn btn-default" style="height:100%; width:100%;"> Edit!</button> </form>'

        # buttontext = '<form style = "height:100%; width:100%"> <button class = "btn btn-default" style="height:100%; width:100%" fieldnametoedit="' + 'fieldname' + fieldnumber + '>Edit</button></form>'
        # '<form style0="height:100%; width:100%;" > <input type="hidden" name="uuid" id="uuidid" value="' + uuid + '"> <input type="hidden" name ="actionname" value = "'+ actionname+'" > <input type="hidden" name="fieldname" id="fieldnameid" value="' + 'fieldname' + fieldnumber + '"><input type="hidden" name="incrementvalue" value="-' + actionqualifier +'"> <button type="submit" class = "btn btn-default" style="height:100%; width:100%;"> Subtract!</button> </form>'
        # return Markup(buttontext)
        return Markup(buttontext)

