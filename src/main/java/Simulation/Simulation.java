package Simulation;

import CustomDataModel.EdgeModel;
import CustomDataModel.NodeModel;
import CustomDataModel.PowerSet;
import JSONModelling.ProvidersRiskReponse;
import JSONModelling.SubsetsRiskResponse;

import java.util.*;

/**
 * Created by Luca Reverberi (thereve@gmail.com) on 21/10/14.
 */

public class Simulation {
	private NodeModel[] nodes;
	private EdgeModel[] edges;

	public Simulation(NodeModel[] nodes, EdgeModel[] edges) {
		// conversion from array to list
		this.nodes = nodes;
		this.edges = edges;
		//this.nodeSubsetsGenerics = new ArrayList<Subset>();
		// group by provider with map


		// createPowerSet create a new powerset of node [a], [a,b], [a,b,c] and at the same time
		// generates in nodeSubsetsGenerics a group of subnet generated before by createPowerSet
		// with some parameters in class Subset like 'risk'
		// this.createPowerSet();
		this.createGroupByProvider();
	}

	public List<ProvidersRiskReponse> getRiskByProvider() {
		List<ProvidersRiskReponse> listOfProviderNodeRisk = new ArrayList<ProvidersRiskReponse>();

		// list of node that contains info group by provider
		Map<String, Set<NodeModel>> nodeSubsetsByProvider;
		nodeSubsetsByProvider = new HashMap<String, Set<NodeModel>>();

		for(NodeModel node : this.nodes) {
			if(nodeSubsetsByProvider.containsKey(node.value.provider)) {
				nodeSubsetsByProvider.get(node.value.provider).add(node);
				System.out.println("sono qui");
			}
			else {
				// create a new subset for a new provider
				Set<NodeModel> newNodeSubsetByProvider = new HashSet<NodeModel>();
				newNodeSubsetByProvider.add(node);
				nodeSubsetsByProvider.put(node.value.provider, newNodeSubsetByProvider);
			}
		}

		// convert hashmap in list of ResponseRiskByProvider
		for (Map.Entry<String, Set<NodeModel>> e : nodeSubsetsByProvider.entrySet()) {
			ProvidersRiskReponse newGroup = new ProvidersRiskReponse();
			newGroup.providerName = e.getKey();
			newGroup.nodes = e.getValue();
			// calcolate risk
			for(NodeModel node : e.getValue()) {
				newGroup.risk = newGroup.risk * node.value.risk;
			}
			listOfProviderNodeRisk.add(newGroup);
		}

		return listOfProviderNodeRisk;
	}

	public List<SubsetsRiskResponse> getSubsetsRisk() {
		Set<Set<NodeModel>> nodePowerSet = this.createPowerSet();
		List<SubsetsRiskResponse> nodesSubsets = new ArrayList<SubsetsRiskResponse>();

		for(Set<NodeModel> nodesSub : nodePowerSet) {
			if(!nodesSub.isEmpty()) { // first element of power set is empty and I don't want this
				SubsetsRiskResponse subset = new SubsetsRiskResponse();

				// add nodes in response <set>
				subset.nodes = nodesSub;

				// calcolate risk
				for(NodeModel node : nodesSub) {
					subset.risk = subset.risk * node.value.risk;
				}
				nodesSubsets.add(subset);
			}
		}
		return nodesSubsets;
	}

	private Set<Set<NodeModel>> createPowerSet() {
		// create normal set of nodes
		Set<NodeModel> nodeSet = new HashSet<NodeModel>();

		for(NodeModel node : this.nodes) {
			nodeSet.add(node);
		}

		// create power set of edges and nodes
		Set<Set<NodeModel>> nodePowerSet = PowerSet.powerSet(nodeSet);

		//this.createSubsetsOfPowerSet(nodePowerSet);
		return nodePowerSet;
	}

/*	private void createSubsetsOfPowerSet(Set<Set<ModelNode>> nodePowerSet) {
		// for every subset, add the subset in a new subset with every information we needs
		for(Set<ModelNode> nodesSub : nodePowerSet) {
			if(!nodesSub.isEmpty()) { // first element of power set is empty and I don't want this
				nodeSubsetsGenerics.add(new Subset(nodesSub));
			}
		}
	}*/

	private void createGroupByProvider() {

	}
}
