package CustomDataModel;

/**
 * Created by Luca Reverberi (thereve@gmail.com) on 19/10/14.
 */

public class NodeModel {
	public String id;
	public Value value;

	public class Value {
		public String 	descr;
		public int 		mem;
		public String 	provider;
		public float	risk;
		public String	type;
	}
}
