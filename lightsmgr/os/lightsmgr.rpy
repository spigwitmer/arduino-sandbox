from twisted.application import internet, service
from twisted.web import static, server, wsgi
from twisted.internet import reactor
from lightsmgr.web import app

root = static.File("/var/www/lightsmgr")
root.indexNames = [ 'index.html' ]
root.putChild(
    "ctl",
    wsgi.WSGIResource(reactor, reactor.getThreadPool(), app)
)

application = service.Application('web')
site = server.Site(root)
sc = service.IServiceCollection(application)
i = internet.TCPServer(80, site)
i.setServiceParent(sc)
