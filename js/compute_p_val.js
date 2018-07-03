const alpha = 3.884;
const beta = -1.523;
document.getElementById("ipos").value = 20395218;
document.getElementById("spos").value = 61502257;

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

// function to calculate average
function calculateAverage(inArray){
    let sum = 0;
    for( let i = 0; i < inArray.length; i++ ){
        sum += inArray[i];
    }

    return sum/inArray.length;
}

// function to check wheather user entered marker position is within the range or not
function checkChrPositions(chri, ipos, spos){
    if((ipos<=chrSize[chri]) && (spos<=chrSize[chri])){
        return 'go';
    } else {
        return 'stop';
    }
}

// function to get Recombination rates between two selected QTLs
function getRrArray(chri, ipos, spos){
    const chrdata = rr[chri];
    const dist_i = [];  // array to hold absolute distance
    const dist_s = [];
    for(let i=0; i<chrdata['position'].length; i++){
        dist_i.push(Math.abs(chrdata['position'][i]-ipos));
        dist_s.push(Math.abs(chrdata['position'][i]-spos));
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


//function to calculate p value as explained in the paper
function computepval(){
    let chr = document.getElementById("chri").value;
    let ipos = document.getElementById("ipos").value;
    let spos = document.getElementById("spos").value;
    console.log('Chr:', chr, 'Position_i:', ipos, "Position_s:", spos);
    if (checkChrPositions(chr, ipos, spos) === 'go'){
        const rr_array = getRrArray(chr, ipos, spos);
        console.log("aray", rr_array);
        const sigma = Math.exp(alpha + (beta * calculateAverage(rr_array)));
        console.log("sigma", sigma);
        let dif = Math.abs((parseFloat(ipos) / 1000000) - (parseFloat(spos) / 1000000));
        let phi_func = dif / (Math.sqrt(2) * sigma);
        console.log("phifunc", phi_func);
        let pval = 2 * (1 - zscorecal(phi_func));
        console.log("p-value", pval);
        document.getElementById("pval").innerHTML = pval;
    } else{
        document.getElementById("pval").innerHTML = "Wrong marker position entered";
    }

}
