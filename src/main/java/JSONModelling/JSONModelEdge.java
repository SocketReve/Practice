package JSONModelling;

/**
 * Created by Luca Reverberi (thereve@gmail.com) on 19/10/14.
 */
public class JSONModelEdge {
	public String u;
	public String v;
	public int id;
	public Value value;

	public class Value {
		public String label;
	}
}
