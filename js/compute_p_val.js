const alpha = 3.656;
const beta = 1.089;

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
    console.log(chr, pos);
    let poly_val = polys[chr];
    let poly_out = 0;
    console.log(poly_val);
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

// function to fetch recombination rate selected QTL
function fetchrts(){
    let chr = document.getElementById("chrs").value;
    let pos = parseFloat(document.getElementById("spos").value);
    console.log(chr, pos);
    let poly_val = polys[chr];
    let poly_out = 0;
    console.log(poly_val);
    for (i=0;i<poly_val.length;i++){
        let s  = poly_val.length - (i+1);
        let temp = poly_val[i]*Math.pow(pos,s);
        poly_out = poly_out+temp
    }
    console.log(poly_out);
    if (poly_out<0){
        poly_out = 0;
    }
    document.getElementById("srr").value = poly_out;
}