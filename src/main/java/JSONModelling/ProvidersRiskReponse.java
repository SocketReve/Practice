package JSONModelling;

import CustomDataModel.NodeModel;

import java.util.HashSet;
import java.util.Set;

/**
 * Created by Luca Reverberi (thereve@gmail.com) on 22/10/14.
 */

public class ProvidersRiskReponse {
	public Set<NodeModel> nodes = new HashSet<NodeModel>();
	public String providerName;
	public float risk = 1;
}
