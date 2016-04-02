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

@actions_api.route('/test/', methods=['GET'])
def test():
    return "hi"

def runactions(newentity, actionname, acc, fieldnumber, actionqualifier):
    if actionname == 'add':
        # application.logger.debug('WOOADD!');
        buttontext =   '<form action="' + acc + '" method="post"> <input type="hidden" name="uuid" id="uuidid" value="' + newentity["uuid"] + '"> <input type="hidden" name ="actionname" value = "'+ actionname+'" > <input type="hidden" name="fieldname" id="fieldnameid" value="' + 'fieldname' + fieldnumber + '"><input type="hidden" name="incrementvalue" value="' + actionqualifier +'"> <button type="submit" class = "btn btn-default"> Add!</button> </form>'
        newentity['fields']['actionname'] = (Markup(buttontext), '', None)
    if actionname == 'subtract':
        # application.logger.debug('WOOADD!');
        buttontext =   '<form action="' + acc + '" method="post"> <input type="hidden" name="uuid" id="uuidid" value="' + newentity["uuid"] + '"> <input type="hidden" name ="actionname" value = "'+ actionname+'" > <input type="hidden" name="fieldname" id="fieldnameid" value="' + 'fieldname' + fieldnumber + '"><input type="hidden" name="incrementvalue" value="-' + actionqualifier +'"> <button type="submit" class = "btn btn-default"> Subtract!</button> </form>'
        newentity['fields']['actionname'] = (Markup(buttontext), '', None)
    return newentity