from flask import Flask, request, session, g, redirect, url_for, \
     abort, render_template, flash
from boto.dynamodb2 import regions
from boto.dynamodb2.layer1 import DynamoDBConnection
from boto.regioninfo import RegionInfo
from boto.dynamodb2 import connect_to_region
from boto.dynamodb2.items import Item
from boto.dynamodb2.fields import HashKey
from boto.dynamodb2.table import Table
import uuid
import json
# from forms import RegistrationForm
DEBUG = True
SECRET_KEY = 'development key'
USERNAME = 'admin'
PASSWORD = 'default'

application = Flask(__name__)
application.config.from_object(__name__)

conn = DynamoDBConnection(
            region=RegionInfo(name='us-west-2',
                              endpoint='dynamodb.us-west-2.amazonaws.com'),
)
# application.logger.debug(conn.list_tables())
entities = Table('entities', connection=conn)

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
        entityname = request.form['entityname']
        numfields = int(request.form['numfields'])
        inputdata = {'entityname':entityname}
        fields = {}
        for fieldnumber in range(1, numfields + 1):
            fieldstring = 'field' + str(fieldnumber)
            fields[fieldstring] = request.form[fieldstring]
        inputdata['numfields'] = numfields
        inputdata['fields'] = json.dumps(fields)
        entities.put_item(data=inputdata)
        Table.create(entityname, schema=[HashKey('uuid')], connection=conn)
        return redirect(url_for('seemyform', ename=entityname))
    return render_template('newentityform.html', form=form, action='/form')

@application.route('/seemyform/<ename>', methods=['GET', 'POST'])
def seemyform(ename):
    application.logger.debug(ename)
    ent = entities.get_item(entityname=ename)
    acc = '/seemyform/'+ename
    form = []
    numfields = ent['numfields']
    fields = json.loads(ent['fields'])
    for fieldnumber in range(1, numfields + 1):
        fieldstring = 'field' + str(fieldnumber)
        form.append({'name':fieldstring, 'text':fields[fieldstring]})
    if request.method == 'POST':
        inputdata = {'uuid':str(uuid.uuid4())}
        for fieldnumber in range(1, numfields + 1):
            fieldstring = 'field' + str(fieldnumber)
            inputdata[fieldstring] = request.form[fieldstring]
        curentity = Table(ename, connection=conn)
        curentity.put_item(data = inputdata)
        return redirect(url_for('seemylist', ename=ename))
    return render_template('entityinstanceform.html', form=form, action=acc, entityname=ename)

@application.route('/seemylist/<ename>', methods=['GET'])
def seemylist(ename):
    entitytable = Table(ename, connection=conn)
    dictlist = [dict(inst) for inst in entitytable.scan()]
    curentity = entities.get_item(entityname=ename)
    fields = json.loads(curentity['fields'])
    outputdictlist = []
    for d in dictlist:
        for key, value in d.iteritems():
            if key[0:5] == 'field':
                application.logger.debug(key)
                fieldname = fields[key]
                newdict = {}
                newdict[fieldname] = d[key]
                outputdictlist.append(newdict)
    application.logger.debug(dictlist)
    # return render_template('form.html', form=form, action=acc)
    return render_template('list.html', dictlist=outputdictlist)


if __name__ == '__main__':
    application.run()
