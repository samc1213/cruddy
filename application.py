from flask import Flask, request, session, g, redirect, url_for, \
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
from gridapis import grids_api
from actionapis import actions_api
from actionapis import runactions
import datetime

# from forms import RegistrationForm
DEBUG = True
SECRET_KEY = 'development key'
USERNAME = 'admin'
PASSWORD = 'default'
UPLOAD_FOLDER = 'uploads'
BUCKET_NAME = 'cruddybucket'

application = Flask(__name__)
application.config.from_object(__name__)
application.register_blueprint(grids_api)
application.register_blueprint(actions_api)
application.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

conn = DynamoDBConnection(
            region=RegionInfo(name='us-west-2',
                              endpoint='dynamodb.us-west-2.amazonaws.com'),
)
# application.logger.debug(conn.list_tables())
entities = Table('entities', connection=conn)

fieldconversiondict = {'int': 'Whole Number', 'string': 'Text', 'entity': 'Child Entity', 'float':'Decimal Number', 'file': 'File', 'phone': 'Phone Number'}
createbuttonindragdroplist = ['add', 'subtract']

s3conn = boto.connect_s3()
# s3conn.create_bucket('cruddybucket')
bucket = s3conn.get_bucket(BUCKET_NAME)
# k = boto.s3.key.Key(bucket)
# k.key = 'boofar'
# k.set_contents_from_string('this is a test')
# application.logger.debug(entities.get_item(entityname='peepee'))
# conn.get_table('entities')
# don't do this in production - use from_envvar

# user = Item(users, data={'username':'sam','boob':'big'})
# user.save(overwrite=True)

# en = users.get_item(username = 'sam')

@application.route('/')
def index():
    return render_template('index.html')
#
@application.route('/form', methods=['GET', 'POST'])
def form():
    if request.method == 'POST':
        application.logger.debug('formdata' + json.dumps(request.form))
        entityname = request.form['entityname']
        numfields = int(request.form['numfields'])
        inputdata = {'entityname':entityname}
        fields = {}
        for fieldnumber in range(1, numfields + 1):
            fieldstring = 'fieldname' + str(fieldnumber)
            typestring = 'fieldtype' + str(fieldnumber)
            entitychildstring = 'entitychildname' + str(fieldnumber)
            fields[fieldstring] = request.form[fieldstring]
            fields[typestring] = request.form[typestring]
            entitychildname = request.form.get(entitychildstring, None)
            if entitychildname:
                fields[entitychildstring] = entitychildname
# PLAEHOLDER - WILL EVENTUALLY STORE NUMACTIONS IN form
            numactions = int(request.form['numactions'+str(fieldnumber)])
            application.logger.debug("fuckhat" + str(numactions))
            for actionnumber in range(1, numactions + 1):
                actionname = 'actionname' + str(fieldnumber) + '-' + str(actionnumber)
                actionvaluestring = 'actionqualifier' + str(fieldnumber) + '-' + str(actionnumber)
                application.logger.debug("fuckhat" + str(actionname))

                fields[actionname] = request.form[actionname]
                application.logger.debug("bitas" + str(actionvaluestring))
                try:
                    fields[actionvaluestring] = request.form[actionvaluestring]
                except:
                    fields[actionvaluestring] = ""
                application.logger.debug("Freeatlast")

        application.logger.debug("titsmcgee")

        inputdata['gridjson'] = "[]"
        application.logger.debug("bitchwagon")

        inputdata['numfields'] = numfields
        inputdata['fields'] = json.dumps(fields)
        application.logger.debug('INPUTDATA' + json.dumps(inputdata))
        entities.put_item(data=inputdata)
        Table.create(entityname, schema=[HashKey('uuid')], connection=conn)
        return redirect(url_for('seemyform', ename=entityname))
        # return 'ok'
    return render_template('newentityform.html', form=form, action='/form')

@application.route('/seemyform/<ename>', methods=['GET', 'POST'])
def seemyform(ename):
    application.logger.debug(ename)
    ent = entities.get_item(entityname=ename)
    acc = '/seemyform/'+ename
    form = []
    numfields = ent['numfields']
    fields = json.loads(ent['fields'])
    entitychildtexts = []
    for fieldnumber in range(1, numfields + 1):
        fieldstring = 'fieldname' + str(fieldnumber)
        fieldtype = fields['fieldtype' + str(fieldnumber)]
        if fieldtype == 'entity':
            entitychildname = fields['entitychildname' + str(fieldnumber)]
            entitytable = Table(entitychildname, connection=conn)
            dictlist = [dict(inst) for inst in entitytable.scan()]
            entitychildinfo = dictlist
            childentity = entities.get_item(entityname=entitychildname)
            childfieldnames = json.loads(childentity['fields'])

            for curdict in dictlist:
                entitychildtext = ""
                for key, val in curdict.iteritems():
                    if key != "uuid" and key != "creationdate":
                        entitychildtext += (str(childfieldnames[key]) + " | " + str(val))
                    else:
                        curuuid = val
                entitychildtexts.append((entitychildtext, curuuid))
        else:
            entitychildname = None
            entitychildinfo = None
            childfieldnames = None
            entitychildtext = None
        form.append({'name':fieldstring, 'text':fields[fieldstring], 'type':fieldtype, 'entitychildinfo': entitychildinfo, 'childfieldnames': childfieldnames, 'entitychildtexts': entitychildtexts})
    if request.method == 'POST':
        inputdata = {'uuid':str(uuid.uuid4())}
        for fieldnumber in range(1, numfields + 1):
            fieldstring = 'fieldname' + str(fieldnumber)
            fieldtype = fields['fieldtype' + str(fieldnumber)]
            if fieldtype == 'file':
                file = request.files[fieldstring]
                if file:
                    filename = file.filename
                    localfilename = os.path.join(application.config['UPLOAD_FOLDER'], filename)
                    file.save(localfilename)
                    k = boto.s3.key.Key(bucket)
                    k.key = ename + '/' + filename
                    k.set_contents_from_filename(localfilename)
                    k.make_public()
                    os.remove(localfilename)
                    inputdata[fieldstring] = filename
            else:
                inputdata[fieldstring] = request.form[fieldstring]
        curentity = Table(ename, connection=conn)
        inputdata['creationdate'] = str(datetime.datetime.utcnow())
        curentity.put_item(data = inputdata)
        return redirect(url_for('gridmessin', ename=ename))
    return render_template('entityinstanceform.html', form=form, action=acc, entityname=ename)



#code finds the element of the keytochange and has the entityname of the thing, just need to update database, refreshes page aferwards
# @application.route('/doaction/<ename>', methods=['GET', 'POST'])
# def doaction(ename):
#     if request.method == 'POST':
#         uuid = request.form['uuid']
#         fieldname = request.form['fieldname']
#         action = str(request.form['actionname'])
#         entityname = ename
#         entitytable = Table(entityname, connection = conn)
#         entityinstancetoact = entitytable.get_item(
#             uuid=uuid
#         )
#         if (action == "add" or action == "subtract"):
#             oldval = int(entityinstancetoact[fieldname])
#             valtoincrement = request.form['incrementvalue']
#             # application.debug.logger(valtoincrement)
#             # application.debug.logger(oldval)
#             newval = oldval + int(valtoincrement)
#             entityinstancetoact[fieldname] = newval
#             entityinstancetoact.save()


#         # return ('', 204)
#         return redirect(url_for('seemylist', ename = ename))

@application.route('/seemylist/<ename>', methods=['GET'])
def seemylist(ename):
    entitytable = Table(ename, connection=conn)
    dictlist = [dict(inst) for inst in entitytable.scan()]
    curentity = entities.get_item(entityname=ename)
    fields = json.loads(curentity['fields'])
    application.logger.debug("fiels~" + json.dumps(fields))
    acc = '/doaction/' + ename
    outputentitylist = []
    for d in dictlist:
        newentity = {}
        newentity['fields'] = {}
        application.logger.debug(d)
        for key, value in d.iteritems():
            application.logger.debug('key' + key)
            if key[0:9] == 'fieldname':
                fieldname = fields[key]
                fieldnumber = key[9:]
                fieldtype = fields['fieldtype' + fieldnumber]
                if fieldtype == 'entity':
                    entitychildname = fields['entitychildname' + fieldnumber]
                    childentitytable = Table(entitychildname, connection=conn)
                    application.logger.debug('ISTHISTHEUUID' + d[key])
                    childentityitem = childentitytable.get_item(uuid = d[key])
                    fieldvalue = ""
                    childentity = entities.get_item(entityname=entitychildname)
                    childfieldnames = json.loads(childentity['fields'])
                    for childfield, childvalue in dict(childentityitem).iteritems():
                        if childfield != 'uuid':
                            fieldvalue += '<b>' + childfieldnames[childfield]+ '</b> ' + childvalue + '<br>'
                    fieldvalue = Markup(fieldvalue)
                if fieldtype == 'file':
                    s3link = 'https://s3.amazonaws.com/' + BUCKET_NAME + '/' + ename + '/' + d[key]
                    fieldvalue = Markup('<a href="' + s3link + '" download>Download</a>')
                    entitychildname = None
                    entitychildinfo = None
                else:
                    entitychildname = None
                    entitychildinfo = None
                    fieldvalue = d[key]
                newentity['fields'][fieldname] = (fieldvalue, fieldconversiondict[fieldtype], entitychildname)
            if key == 'uuid':
                newentity['uuid'] = value
        for field in fields:
            application.logger.debug(field)
            if field[0:10] == 'actionname':
                application.logger.debug('ACTIONfield: ' + field)
                actionname = fields[field]
                application.logger.debug('ACTIONname: ' + actionname)
                actionnumber = field[10:].split('-')[1]
                fieldnumber = field[10:].split('-')[0]
                try:
                    application.logger.debug(actionname)
                    actionqualifier = fields['actionqualifier' +str(fieldnumber)+'-' + str(actionnumber)]
                except:
                    application.logger.debug(actionname)
                    actionqualifier = ""

                newentity = runactions(newentity, actionname, acc, fieldnumber, actionqualifier, fieldvalue)
                # if actionname == 'add':
                #     application.logger.debug('WOOADD!');
                    # buttontext =   '<form action="' + acc + '" method="post"> <input type="hidden" name="uuid" id="uuidid" value="' + newentity["uuid"] + '"> <input type="hidden" name="fieldname" id="fieldnameid" value="' + 'fieldname' + fieldnumber + '"><input type="hidden" name="incrementvalue" value="' + actionqualifier +'"> <button type="submit" class = "btn btn-default"> Add!</button> </form>'
                #     newentity['fields']['actionname'] = (Markup(buttontext), '', None)
                # if actionname == 'subtract':
                #     application.logger.debug('WOOADD!');
                #     buttontext =   '<form action="' + acc + '" method="post"> <input type="hidden" name="uuid" id="uuidid" value="' + newentity["uuid"] + '"> <input type="hidden" name="fieldname" id="fieldnameid" value="' + 'fieldname' + fieldnumber + '"><input type="hidden" name="incrementvalue" value="-' + actionqualifier +'"> <button type="submit" class = "btn btn-default"> Subtract!</button> </form>'
                #     newentity['fields']['actionname'] = (Markup(buttontext), '', None)
        outputentitylist.append(newentity)
    application.logger.debug(outputentitylist)

    # return render_template('form.html', form=form, action=acc)
    return render_template('list.html', entitylist=outputentitylist, entityname=ename, action=acc)

@application.route('/gridmessin/<ename>', methods=['GET'])
def gridmessin(ename):
    curentity = entities.get_item(entityname=ename)
    fields = json.loads(curentity['fields'])
    goodfields = {}
    for fieldnamenumber, fieldname in fields.iteritems():
        if fieldnamenumber[0:10]=="actionname":
            goodfields[fieldnamenumber] = fieldname
        if fieldnamenumber[0:9] =="fieldname":
            fieldtype = fields['fieldtype' + fieldnamenumber[9:]]
            if fieldtype == 'entity':
                entitychildname = fields['entitychildname' + fieldnamenumber[9:]]
                childentityinfo= entities.get_item(entityname = entitychildname)
                childfieldnames = json.loads(childentityinfo['fields'])
                for cfn, val in childfieldnames.iteritems():
                    if cfn[0:9] == 'fieldname':
                        goodfields[entitychildname + '-' + cfn] = entitychildname + '-' + val
            else:
                goodfields[fieldnamenumber] = fieldname

    return render_template('gridmessin.html', fields=goodfields)


@application.route('/savegrid/<ename>', methods=['POST'])
def savegrid(ename):
    gridjson = request.form['gridjson']
    application.logger.debug(gridjson + "ENAEM" + ename)
    entity = entities.get_item(entityname = ename)
    entity['gridjson'] = gridjson
    entity.save()
    return 'OK'

@application.route('/seemytable/<ename>', methods=['GET'])
def seemytable(ename):
    entitytable = Table(ename, connection=conn)
    dictlist = [dict(inst) for inst in entitytable.scan()]
    curentity = entities.get_item(entityname=ename)
    fields = json.loads(curentity['fields'])
    acc = '/increment/' + ename
    outputentitylist = []
    for d in dictlist:
        newentity = {}
        newentity['fields'] = {}
        application.logger.debug(d)
        for key, value in d.iteritems():
            application.logger.debug('key' + key)
            if key[0:5] == 'field':
                fieldname = fields[key]
                newentity['fields'][fieldname] = (d[key], key)
            if key == 'uuid':
                newentity['uuid'] = value
        outputentitylist.append(newentity)
    application.logger.debug(outputentitylist)

    # return render_template('form.html', form=form, action=acc)
    return render_template('table.html', entitylist=outputentitylist, entityname=ename, action=acc)


if __name__ == '__main__':
    application.run()
