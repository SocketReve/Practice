/**
 * Created by ALBERTO SACCHI
 */

angular.module("PracticeSimulator").factory("PracticeShapley", function() {
	var Shapley = function(nodes) {
		var vChar = [];
		var vNum = [];
		var vCharF = [];
		var prova = [];
		var fat=0,min=0,minBefore=0,step=0,sumV1=0,sumV2=0,a=0;
		var vR = [];
		var estimatedRiskPerNode = [];

		for(var node in nodes) {

			vChar.push(node);

			vNum.push(nodes[node].PMAL);

			if (nodes[node].TYPE == "COMP"){
				vCharF.push(node);
			}
		}

		//Vari controlli prima di eseguire il programma
		if (vChar.length==0)
		{
			console.log("Il vettore dei nodi è vuoto");
			return;
		}
		if (vNum.length==0)
		{
			console.log("Il vettore dei valori nodi è vuoto");
			return;
		}
		if (vCharF.length==0)
		{
			console.log("Il vettore dei nodi fondamentali è vuoto");
			return;
		}
		if (vChar.length!=vNum.length)
		{
			console.log("La lunghezza del vettore dei nodi ("+vChar.length+") è diversa dalla lunghezza del vettore dei valori dei nodi ("+vNum.length+")");
			return;
		}

		//Inizializzo a 0 l'array per i risultati
		for (var i = 0; i < vChar.length; i++)
		{vR[i]=0;}
		fattoriale(vNum.length);
		permute(vNum,vChar,0);

		for (var i = 0; i < vR.length; i++)
		{vR[i]=vR[i]/fat;}
		//console.log(vR);

		if (vChar.length!=vR.length)
		{
			console.log("La lunghezza del vettore dei nodi ("+vChar.length+") è diversa dalla lunghezza del vettore dei valori di shapley dei nodi ("+vR.length+")");
			return;
		}


		//Creo l'array di oggetti
		for (var i = 0; i < vR.length; i++)
		{estimatedRiskPerNode.push({
			id: vChar[i],
			risk: vR[i].toFixed(2)
		});
		}
		//console.log(estimatedRiskPerNode);



		//Fa il fattoriale
		function fattoriale(a)
		{
			var f=1;
			for(var i=1; i<=a; i=i+1)
			{
				f=f*i;
			}
			fat = f;
		}


		function permute(pNum, pChar, index) {

			if (pNum.length == index) {
				LeggiVettore(pNum, pChar);
			} else {
				for (var i = index; i < pNum.length; i++) {
					var input = pNum.slice(0);
					var temp = input[i];
					input[i] = input[index];
					input[index] = temp;
					var input2 = pChar.slice(0);
					var temp2 = input2[i];
					input2[i] = input2[index];
					input2[index] = temp2;
					permute(input, input2, index + 1);
				}
			}
		}
		//Legge il vettore ed esegue i vari calcoli per il calcolare il valore di shapley
		function LeggiVettore(vettNumPerm,vettCharPerm)
		{
			for (var i = 0; i < vettNumPerm.length; i++)
			{
				var fond = 0;
				minBefore= Math.min (sumV1,sumV2);
				//console.log(minBefore,sumV1,sumV2)
				for (var j = 0; j < vCharF.length; j++)
				{
					if ((vettCharPerm[i] == vCharF[j]))
					{
						fond = 1;
						sumV1=sumV1+vettNumPerm[i];
						min=Math.min (sumV1,sumV2);
						step=min-minBefore;
						for (var k = 0; k < vChar.length; k++)
						{
							if (vettCharPerm[i] == vChar[k])
							{
								vR[k]=vR[k]+step;

							}
						}
					}
				}
				if (fond==0)
				{
					sumV2=sumV2+vettNumPerm[i];
					min=Math.min (sumV1,sumV2);
					step=min-minBefore;
					for (var k = 0; k < vChar.length; k++)
					{
						if (vettCharPerm[i] == vChar[k])
						{
							vR[k]=vR[k]+step;

						}
					}
				}


			}
			sumV1=0;
			sumV2=0;

		}

		return estimatedRiskPerNode;
	};

	return Shapley;
});
