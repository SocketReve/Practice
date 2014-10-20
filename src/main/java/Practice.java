/**
 * Created by Luca Reverberi (thereve@gmail.com) on 13/10/14.
 */

import RestService.RestHandler;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.File;

public class Practice  {
	// init constant
	private static final String localPath = new File("").getAbsolutePath();
	private static final String WEB_PATH_PRACTICE =  "file://" + localPath + "/Web/";
	private static final int HTTP_PORT_NUMBER = 8182;

	// init logger
	public static Logger log = LogManager.getLogger(Practice.class);

	public static void main(final String[] args) {
		RestHandler PracticeHandler;

		// start server rest
		try {
			PracticeHandler = new RestHandler(WEB_PATH_PRACTICE, HTTP_PORT_NUMBER);
			PracticeHandler.start();
			Practice.log.info("WebServer Started");
		}
		catch (Exception e){
			Practice.log.error("WebServer cannot start: "+e.toString());
			//System.out.println(e.getCause());
		}
	}
}