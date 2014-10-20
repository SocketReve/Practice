package RestService;

/**
 * Created by socketreve on 13/10/14.
 */

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.restlet.Application;
import org.restlet.Component;
import org.restlet.Restlet;
import org.restlet.data.Protocol;
import org.restlet.resource.Directory;
import org.restlet.routing.Router;

public class RestHandler {
	private Router practiceRouter;
	private Component practiceComponent;

	public static Logger log = LogManager.getLogger(RestHandler.class);

	public RestHandler(final String WEB_FOLDER_PATH, final int HTTP_PORT_NUMBER) {
		practiceRouter = new Router();
		practiceComponent = new Component();

		// router path
		practiceRouter.attach("/uploadNetwork", RestNetworkUpload.class);
		practiceRouter.attach("/ping", RestPing.class);

		// main path for local web
		Application practiceRestService = new Application() {
			@Override
			public Restlet createInboundRoot() {
				practiceRouter.setContext(getContext());
				practiceRouter.attach("/", new Directory(getContext(),WEB_FOLDER_PATH));
				return practiceRouter;
			};
		};

		// HTTP service on port
		practiceComponent.getServers().add(Protocol.HTTP, HTTP_PORT_NUMBER);
		practiceComponent.getClients().add(Protocol.FILE);

		practiceComponent.getDefaultHost().attach(practiceRestService);
	}

	public void start() throws Exception {
		// in case of exception, the control will be in main Practice class
		practiceComponent.start();
	}
}
