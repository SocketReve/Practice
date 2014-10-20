package RestService;

import com.google.gson.JsonObject;
import org.restlet.resource.ServerResource;
import org.restlet.resource.Get;

import static java.lang.System.out;

/**
 * Created by socketreve on 14/10/14.
 */
// simple class for verify if backend is up
public class RestPing extends ServerResource {
	@Get
	public String ping() {
		JsonObject pong = new JsonObject();
		pong.addProperty("status","pong");
		return pong.toString();
	}
}
