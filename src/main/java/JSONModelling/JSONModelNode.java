package JSONModelling;

/**
 * Created by socketreve on 19/10/14.
 */


public class JSONModelNode {
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
