const alpha = 3.656;
const beta = -1.089;
document.getElementById("ipos").value = 1;
document.getElementById("spos").value = 1;

// Size of chromosomes
const chrSize = {'Chr1':502310573, 'Chr2':651642770, 'Chr3':627112410, 'Chr4':525901714, 'Chr5':577254575, 'Chr6':495946541, 'Chr7':644563824};

// Change selected chromosome name based on identified chromosome name
$("#chri").change(function () {
      document.getElementById("chrs").value = document.getElementById("chri").value;
  })
  .change();
// Change identified chromosome name based on selected chromosome name
$("#chrs").change(function () {
      document.getElementById("chri").value = document.getElementById("chrs").value;
  })
  .change();


// function to check weather user entered marker position is within the range or not
function checkChrPositions(){
    const chri = document.getElementById("chri").value;
    const ipos = document.getElementById("ipos").value;
    const spos = document.getElementById("spos").value;
    if((ipos<=chrSize[chri]) && (spos<=chrSize[chri])){
        return 'go';
    } else {
        return 'stop';
    }
}

// function to get Recombination rates between two selected QTLs
function getRrArray(){
    const chri = document.getElementById("chri").value;
    const ipos = document.getElementById("ipos").value;
    const spos = document.getElementById("spos").value;
    const chrdata = rr[chri];
    const dist_i = [];  // array to hold absolute distance
    const dist_s = [];
    for(i=0;i<chrdata['Gene_start'].length;i++){
        dist_i.push(Math.abs(chrdata['Gene_start'][i]-ipos));
        dist_s.push(Math.abs(chrdata['Gene_start'][i]-spos));
    }
    const arrMin_i = Math.min.apply(null, dist_i); // get minimum of dist array
    const arrMin_s = Math.min.apply(null, dist_s);
    const arrMinPos_i = dist_i.indexOf(arrMin_i); // get the index of minimum
    const arrMinPos_s = dist_s.indexOf(arrMin_s);
    function getRrSlice(chrdata, arrMinPos_i, arrMinPos_s) {
        if (arrMinPos_i === arrMinPos_s) {
            return [chrdata['rr'][arrMinPos_i]];
        } else if (arrMinPos_i < arrMinPos_s) {
            return chrdata['rr'].slice(arrMinPos_i, arrMinPos_s);
        } else {
            return chrdata['rr'].slice(arrMinPos_s, arrMinPos_i);
        }
    }
    return getRrSlice(chrdata, arrMinPos_i, arrMinPos_s);
}

// Calculates Sigma from the array from getRrArray function
function calculateSigma(aray){
    if (aray.length === 1){
        return Math.exp(alpha + (beta * aray[0]))
    } else{
        //let sigma_aray = []; //array to store sigma values
        //for (i=0; i<aray.length; i++){
        //    sigma_aray.push(alpha + (beta * aray[i]));
        //}
        let sigma_total = 0;
        for (i=0; i<aray.length; i++){ //calculating mean value for the sigma array
            sigma_total+=aray[i];
        }
        let rr_mean = sigma_total/sigma_aray.length;  
        return Math.exp(alpha + (beta * rr_mean));
    }

}


//function to calculate p value as explained in the paper
function computepval(){
    let chr = document.getElementById("chri").value;
    let ipos = document.getElementById("ipos").value;
    let spos = document.getElementById("spos").value;
    console.log('Chr:', chr, 'Position_i:', ipos, "Position_s:", spos);
    if (checkChrPositions() === 'go'){
        const rr_array = getRrArray();
        console.log("aray", rr_array);
        const temp = calculateSigma(rr_array);
        //let sigma = Math.exp(temp);
        console.log("sigma", temp);
        let dif = Math.abs((parseFloat(ipos) / 1000000) - (parseFloat(spos) / 1000000));
        let phi_func = dif / (Math.sqrt(2) * temp);
        console.log("phifunc", phi_func);
        let pval = 2 * (1 - zscorecal(phi_func));
        console.log("p-value", pval);
        document.getElementById("pval").innerHTML = pval;
    } else{
        document.getElementById("pval").innerHTML = "Wrong marker position entered";
    }

}
