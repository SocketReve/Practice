package RestService;

/**
 * Created by Luca Reverberi (thereve@gmail.com) on 13/10/14.
 */

import JSONModelling.UploadNetworkModel;
import Simulation.Simulation;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import org.restlet.representation.Representation;
import org.restlet.resource.Post;
import org.restlet.resource.ServerResource;

public class RestNetworkUpload extends ServerResource {
	@Post
	public String uploadGraph(Representation entity) throws InterruptedException {
		Gson gson = new Gson();

		try {
			RestHandler.log.info("Received JSON from "+getClientInfo().getAddress());
			UploadNetworkModel obj = gson.fromJson(entity.getText(), UploadNetworkModel.class);
			Simulation sim = new Simulation(obj.nodes, obj.edges);
			return gson.toJson(sim.riskByProvider());
		}
		catch (Exception e) {
			RestHandler.log.info("Received wrong data from "+getClientInfo().getAddress());

			JsonObject status = new JsonObject();
			status.addProperty("status","jsonError");
			return status.toString();
		}

		/*// faccio qualcosa
		Thread.sleep(5000);

		JsonObject status = new JsonObject();
		status.addProperty("status","ok");
		return status.toString();*/
	}
}
