package CustomDataModel;

import java.util.HashSet;
import java.util.Set;

/**
 * Created by Luca Reverberi (thereve@gmail.com) on 21/10/14.
 */

public class Subset {
	private Set<ModelNode> nodesInSubset;
	private float risk = 1;

	public Subset(Set<ModelNode> nodes) {
		nodesInSubset = nodes;

		// calculate risk
		for(ModelNode node : nodesInSubset) {
			risk = risk * node.value.risk;
		}
	}

	public Set<String> getElementsName() {
		Set<String> nodesName = new HashSet<String>();

		for(ModelNode e : nodesInSubset) {
			nodesName.add(e.id);
		}
		return nodesName;
	}

	public void addElement(ModelNode node) {
		this.nodesInSubset.add(node);
	}

	public float getRisk() {
		return risk;
	}
}
