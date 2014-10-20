package RestService;

/**
 * Created by Luca Reverberi (thereve@gmail.com) on 13/10/14.
 */

import JSONModelling.JSONModel;
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
			//json = new JSONObject(entity.getText());
			JSONModel obj = gson.fromJson(entity.getText(), JSONModel.class);

			for(int i = 0; i < obj.nodes.length; i++) {
				System.out.println(obj.nodes[i].id);
				System.out.println(obj.nodes[i].value.descr);
				System.out.println(obj.nodes[i].value.mem);
				System.out.println(obj.nodes[i].value.provider);
				System.out.println(obj.nodes[i].value.risk);
				System.out.println(obj.nodes[i].value.type);
				//System.out.println(obj.nodes[i].id);
				//System.out.println(obj.nodes[i].id);
			}

			for(int i = 0; i < obj.edges.length; i++) {
				System.out.println(obj.edges[i].id);
			}

			RestHandler.log.info("Received JSON from "+getClientInfo().getAddress());
		}
		catch (Exception e) {
			RestHandler.log.info("Received wrong data from "+getClientInfo().getAddress());

			JsonObject status = new JsonObject();
			status.addProperty("status","jsonError");
			return status.toString();
		}

		// faccio qualcosa
		Thread.sleep(5000);

		JsonObject status = new JsonObject();
		status.addProperty("status","ok");
		return status.toString();
	}
}
