const alpha = 3.656;
const beta = 1.089;
/// Start of chromosome arms
const st = {'1S':0, '1L':160000000, '2S':0, '2L':233500000, '3S':0, '3L':220000000, '4S':0, '4L':187000000, '5S':0, '5L':170000000, '6S':0, '6L':212500000, '7S':0, '7L':306500000 };
// End of Chromosme arms
const ed = {'1S':160000000, '1L':502310573, '2S':233500000, '2L':651642770, '3S':220000000, '3L':627112410, '4S':187000000, '4L':525901714, '5S':170000000, '5L':577254575, '6S':212500000, '6L':495946541, '7S':306500000, '7L':644563824};
/// Change selected chromosome name based on identified chromosome name
$("#chri").change(function () {
      document.getElementById("chrs").value = document.getElementById("chri").value;
  })
  .change();
/// Change identified chromosome name based on selected chromosome name
$("#chrs").change(function () {
      document.getElementById("chri").value = document.getElementById("chrs").value;
  })
  .change();

//function to calculate p value as explained in the paper
function computepval(){
    let irr = document.getElementById("irr").value;
    let srr = document.getElementById("srr").value;
    let ipos = document.getElementById("ipos").value;
    let spos = document.getElementById("spos").value;
    let rr = (parseFloat(irr) + parseFloat(srr))/2;
    let sigma = Math.pow(10,(alpha+beta*rr));
    let dif = Math.abs((parseFloat(ipos)/1000000)-(parseFloat(spos)/1000000));
    let phi_func = dif/(Math.sqrt(2)*sigma);
    let pval = 2*(1-zscorecal(phi_func));
    document.getElementById("pval").innerHTML = pval;
}

// function to fetch recombination rate identified QTL
function fetchrti(){
    let chr = document.getElementById("chri").value;
    let pos = parseFloat(document.getElementById("ipos").value);
    let poly_val = polys[chr];
    let poly_out = 0;
    // Check enetred position is correct or not
    if ((pos>st[chr]) && (pos<ed[chr])){
        document.getElementById("i_error").innerText = "";
        for (i=0;i<poly_val.length;i++){
        let s  = poly_val.length - (i+1);
        let temp = poly_val[i]*Math.pow(pos,s);
        poly_out = poly_out+temp
        }
        console.log(poly_out);
        if (poly_out<0){
            poly_out = 0;
        }
        document.getElementById("irr").value = poly_out;
        }
        else{
        document.getElementById("i_error").innerText = "Wrong position given";
    }

}

// function to fetch recombination rate selected QTL
function fetchrts(){
    let chr = document.getElementById("chrs").value;
    let pos = parseFloat(document.getElementById("spos").value);
    let poly_val = polys[chr];
    let poly_out = 0;
    if ((pos>st[chr]) && (pos<ed[chr])) {
         document.getElementById("s_error").innerText = "";
        for (i = 0; i < poly_val.length; i++) {
            let s = poly_val.length - (i + 1);
            let temp = poly_val[i] * Math.pow(pos, s);
            poly_out = poly_out + temp
        }
        console.log(poly_out);
        if (poly_out < 0) {
            poly_out = 0;
        }
        document.getElementById("srr").value = poly_out;
    }
    else{
        document.getElementById("s_error").innerText = "Wrong position given";
    }
}