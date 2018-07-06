const alpha = 3.656;
const beta = -1.089;

// Size of chromosomes
const chrSize = {'Chr1':502310573, 'Chr2':651642770, 'Chr3':627112410, 'Chr4':525901714, 'Chr5':577254575, 'Chr6':495946541, 'Chr7':644563824};

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
    if((ipos>0) && (spos>0) && (ipos<=chrSize[chri]) && (spos<=chrSize[chri])){
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

// function to calculate sigma from an array of recombination rate
function calculateSigmaAverage(rr_array){
    let sigma_array = [];
    for (let i=0; i<rr_array.length; i++){
        sigma_array.push(Math.exp(alpha + (beta * rr_array[i])))
    }
    return calculateAverage(sigma_array);
}

////////////////////// Code for tab 1 /////////////////
// assign initial value for tab1 chromosome positions
document.getElementById("t1_ipos").value = 20395218;
document.getElementById("t1_spos").value = 61502257;

//// Change selected chromosome name based on identified chromosome name
$("#t1_chri").change(function () {
      document.getElementById("t1_chrs").value = document.getElementById("t1_chri").value;
  }).change();
//// Change identified chromosome name based on selected chromosome name
$("#t1_chrs").change(function () {
      document.getElementById("t1_chri").value = document.getElementById("t1_chrs").value;
  }).change();

//// function to calculate p value for the test one
function t1_computepval(){
    const t1_chr = document.getElementById("t1_chri").value;
    const t1_ipos = document.getElementById("t1_ipos").value;
    const t1_spos = document.getElementById("t1_spos").value;
    console.log('Chr:', t1_chr, 'Position_i:', t1_ipos, "Position_s:", t1_spos);
    if (checkChrPositions(t1_chr, t1_ipos, t1_spos) === 'go'){
        const t1_rr_array = getRrArray(t1_chr, t1_ipos, t1_spos);
        console.log("aray", t1_rr_array);
        const t1_sigma = calculateSigmaAverage(t1_rr_array);
        console.log("sigma", t1_sigma);
        let t1_dif = Math.abs((parseFloat(t1_ipos) / 1000000) - (parseFloat(t1_spos) / 1000000));
        let t1_phi_func = t1_dif / (Math.sqrt(2) * t1_sigma);
        console.log("phifunc", t1_phi_func);
        let t1_pval = 2 * (1 - zscorecal(t1_phi_func));
        console.log("p-value", t1_pval);
        document.getElementById("t1_pval").innerHTML = t1_pval;
    } else {
        document.getElementById("t1_pval").innerHTML = "Wrong marker position entered";
    }
}

//////////////////// code for tab 2 ////////////////////////////
document.getElementById("t2_ipos").value = 20395218;
document.getElementById("t2_spos").value = "41502257,51502257,61502257";
// Change selected chromosome name based on identified chromosome name
$("#t2_chri").change(function () {
      document.getElementById("t2_chrs").value = document.getElementById("t2_chri").value;
  }).change();
// Change identified chromosome name based on selected chromosome name
$("#t2_chrs").change(function () {
      document.getElementById("t2_chri").value = document.getElementById("t2_chrs").value;
  }).change();

function t2_computepval(){
    const t2_chr = document.getElementById("t2_chri").value;
    const t2_ipos = document.getElementById("t2_ipos").value;
    let t2_spos = document.getElementById("t2_spos").value;
    t2_spos = t2_spos.split(',');
    let t2_spos_int = [];
    for (let i =0; i<t2_spos.length; i++){
        t2_spos_int.push(parseInt(t2_spos[i]));
    }
    let temp_t2array = t2_spos_int;
    temp_t2array.push(parseInt(t2_ipos));
    const t2_pos_min = Math.min.apply(null, temp_t2array);
    const t2_pos_max = Math.max.apply(null, temp_t2array);
    console.log("Min-Max:",t2_chr, t2_pos_min, t2_pos_max);
    if (checkChrPositions(t2_chr, t2_pos_min, t2_pos_max) === 'go') {
        const t2_rr_array = getRrArray(t2_chr, t2_pos_min, t2_pos_max);
        console.log("t2_Rr_array:", t2_rr_array);
        const t2_sigma = calculateSigmaAverage(t2_rr_array);
        console.log("t2 sigma", t2_sigma);
        let t2_spos_ave = calculateAverage(t2_spos_int);
        const t2_dif = Math.abs((parseFloat(t2_ipos) / 1000000) - (parseFloat(t2_spos_ave) / 1000000));
        const t2_phi = t2_dif / (Math.sqrt(1 + (Math.pow(t2_spos.length, -1))) * t2_sigma);
        const t2_pval = 2 * (1 - zscorecal(t2_phi));
        console.log(t2_pval);
        document.getElementById("t2_pval").innerHTML = t2_pval;
    } else {
        document.getElementById("t2_pval").innerHTML = "Wrong marker position entered";
    }
}

/////////////// code for tab 3 ////////////////////////
document.getElementById("t3_ipos").value = 20395218;
document.getElementById("t3_spos").value = 61502257;
// Change selected chromosome name based on identified chromosome name
$("#t3_chri").change(function () {
      document.getElementById("t3_chrs").value = document.getElementById("t3_chri").value;
  }).change();
// Change identified chromosome name based on selected chromosome name
$("#t3_chrs").change(function () {
      document.getElementById("t3_chri").value = document.getElementById("t3_chrs").value;
  }).change();

function t3_computepval(){
    const t3_chr = document.getElementById("t3_chri").value;
    const t3_ipos = document.getElementById("t3_ipos").value;
    const t3_spos = document.getElementById("t3_spos").value;
    console.log(t3_chr, t3_ipos, t3_spos);
    if (checkChrPositions(t3_chr, t3_ipos, t3_spos) === 'go') {
        const t3_xyDif = Math.abs((parseFloat(t3_ipos) / 1000000) - (parseFloat(t3_spos) / 1000000));
        const t3_rr_array = getRrArray(t3_chr, t3_ipos, t3_spos);
        console.log("t3_Rr_array:", t3_rr_array);
        const t3_sigma = calculateSigmaAverage(t3_rr_array);
        const t3_phi = t3_xyDif/t3_sigma;
        const t3_pval =  2 * (1 - zscorecal(t3_phi));
        document.getElementById("t3_pval").innerHTML = t3_pval;
    } else {
        document.getElementById("t3_pval").innerHTML = "Wrong marker position entered";
    }
}