package Simulation;

import CustomDataModel.ModelEdge;
import CustomDataModel.ModelNode;
import CustomDataModel.Subset;
import CustomDataModel.PowerSet;
import JSONModelling.ResponseRiskByProvider;

import java.util.*;

/**
 * Created by Luca Reverberi (thereve@gmail.com) on 21/10/14.
 */

public class Simulation {
	private ModelNode[] nodes;
	private ModelEdge[] edges;

	// for every subset, i create a new class that contains many info about this subset
	private List<Subset> nodeSubsetsGenerics;

	// list of node that contains info group by provider
	private Map<String, Subset> nodeSubsetsByProvider;

	public Simulation(ModelNode[] nodes, ModelEdge[] edges) {
		// conversion from array to list
		this.nodes = nodes;
		this.edges = edges;
		this.nodeSubsetsGenerics = new ArrayList<Subset>();
		// group by provider with map
		this.nodeSubsetsByProvider = new HashMap<String, Subset>();

		// createPowerSet create a new powerset of node [a], [a,b], [a,b,c] and at the same time
		// generates in nodeSubsetsGenerics a group of subnet generated before by createPowerSet
		// with some parameters in class Subset like 'risk'
		this.createPowerSet();
		this.createGroupByProvider();
	}

	private void createPowerSet() {
		// create normal set of nodes
		Set<ModelNode> nodeSet = new HashSet<ModelNode>();

		for(ModelNode node : this.nodes) {
			nodeSet.add(node);
		}

		// create power set of edges and nodes
		Set<Set<ModelNode>> nodePowerSet = PowerSet.powerSet(nodeSet);

		this.createSubsetsOfPowerSet(nodePowerSet);
	}

	private void createSubsetsOfPowerSet(Set<Set<ModelNode>> nodePowerSet) {
		// for every subset, add the subset in a new subset with every information we needs
		for(Set<ModelNode> nodesSub : nodePowerSet) {
			if(!nodesSub.isEmpty()) { // first element of power set is empty and I don't want this
				nodeSubsetsGenerics.add(new Subset(nodesSub));
			}
		}
	}

	private void createGroupByProvider() {
		for(ModelNode node : this.nodes) {
			if(nodeSubsetsByProvider.containsKey(node.value.provider)) {
				nodeSubsetsByProvider.get(node.value.provider).addElement(node);
			}
			else {
				// create a new subset for a new provider
				Set<ModelNode> newNodeSubsetByProvider = new HashSet<ModelNode>();
				newNodeSubsetByProvider.add(node);
				nodeSubsetsByProvider.put(node.value.provider, new Subset(newNodeSubsetByProvider));
			}
		}
	}

	public List<ResponseRiskByProvider> riskByProvider() {
		List<ResponseRiskByProvider> listOfProviderNodeRisk = new ArrayList<ResponseRiskByProvider>();

		// convert hashmap in list of ResponseRiskByProvider
		for (Map.Entry<String, Subset> e : nodeSubsetsByProvider.entrySet()) {
			ResponseRiskByProvider newGroup = new ResponseRiskByProvider();
			newGroup.providerName = e.getKey();
			newGroup.nodes = e.getValue().getElementsName();
			newGroup.risk = e.getValue().getRisk();
			listOfProviderNodeRisk.add(newGroup);
		}

		return listOfProviderNodeRisk;
	}

	private void printRiskBySubset() {

	}
}
