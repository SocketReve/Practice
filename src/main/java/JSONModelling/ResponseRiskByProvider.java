package JSONModelling;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Created by Luca Reverberi (thereve@gmail.com) on 22/10/14.
 */

public class ResponseRiskByProvider {
	public Set<String> nodes = new HashSet<String>();
	public String providerName;
	public float risk;
}
