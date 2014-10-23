package CustomDataModel;

import java.util.HashSet;
import java.util.Set;

/**
 * Created by Luca Reverberi (thereve@gmail.com) on 21/10/14.
 */

public class Subset {
	private Set<NodeModel> nodesInSubset;
	private float risk = 1;

	public Subset(Set<NodeModel> nodes) {
		nodesInSubset = nodes;

		// calculate risk
		for(NodeModel node : nodesInSubset) {
			risk = risk * node.value.risk;
		}
	}

	public Set<String> getElementsName() {
		Set<String> nodesName = new HashSet<String>();

		for(NodeModel e : nodesInSubset) {
			nodesName.add(e.id);
		}
		return nodesName;
	}

	public void addElement(NodeModel node) {
		this.nodesInSubset.add(node);
	}

	public float getRisk() {
		return risk;
	}
}
