// selectors
const colorDivs=document.querySelectorAll('.color');
const sliders=document.querySelectorAll('input[type="range"]');
const currenthexes=document.querySelectorAll('.color h2');
const popup =document.querySelector('.copy-container');
const close=document.querySelectorAll('.close-adjustment');
const sliderhold=document.querySelectorAll('.sliders');
const adjust=document.querySelectorAll('.adjust');
const lock=document.querySelectorAll('.lock');
const gener=document.querySelector('.generate'); 
let savedPalet=[];

// add events listeners
sliders.forEach(slider=>{
   slider.addEventListener('input',hslControls);
});

colorDivs.forEach((div,index)=>{
 div.addEventListener('change',()=>{
 	updateUi(index);
 	// checkTextContrast
 });
});

currenthexes.forEach(hex=>{
	hex.addEventListener('click',()=>{
        copyToClipBoard(hex);
	});
});

popup.addEventListener('transitionend',()=>{
	const popbox=popup.children[0];
	popbox.classList.remove('active');
	popup.classList.remove("active");
});

adjust.forEach((adj,index)=>{
	adj.addEventListener('click',()=>{
      opensliders(index);
	});
});
close.forEach((clos,index)=>{
  clos.addEventListener('click',()=>{
  	closeSliders(index);
  });
});

gener.addEventListener('click',RandomColors);

 lock.forEach((loc,index)=>{
 loc.addEventListener('click',()=>{
    colorDivs[index].classList.toggle('lock');
    if(colorDivs[index].classList.contains('lock')){
    	loc.firstElementChild.setAttribute('class','fas fa-lock');
    	// console.log(loc.firstElementChild)

    }else{
    	loc.firstElementChild.setAttribute('class','fas fa-lock-open');
    }
 });
 });



// ========================================
// functions

// color generator 
function generateHex(){
	// const letters='0123456789ABCDEF';
	// let hash="#";
	// for (let i =0;i<6;i++){
	// 	hash+=letters[Math.floor(Math.random() * 16)];
	// }
	// return hash;
	// ===========================

	// or we can do it like that 
    
    const hexcolor=chroma.random();
   		 return hexcolor;

      }
        // to call generate function
   // let randomHex=generateHex();
    
    // contrast function
    function checkTextContrast(color,text){
    	const luminance=chroma(color).luminance();
    	// console.log(luminance);
    	if(luminance > .5){
    		text.style.color='black';
    	} else{
    		text.style.color='white';

    	}

    } 

 // RandomColors
 let initialColor=[];
 function RandomColors(){
 	
 	colorDivs.forEach((div,index)=>{

        const textHexe=div.children[0];
        const randomColor=generateHex();
        // add it to the array
        
        // console.log(initialColor); 
        // khasni n3awedha mba3d
         if(div.classList.contains('lock')){
         	initialColor.push(textHexe.innerText);
         	return;
         }else{
         	initialColor.push(chroma(randomColor).hex());
         }

        // adding to the background

        div.style.background=randomColor;
        textHexe.innerText=randomColor;

        // check contrast 
        
        checkTextContrast(randomColor,textHexe);

        // initial colorize sliders$
    	const color = chroma(randomColor);
    	const sliders=div.querySelectorAll('input');
    	
    	const hue=sliders[0];
    	const brightness=sliders[1];
    	const saturation =sliders[2];

        colorizeSliders(color,hue, brightness,saturation);



 	} );
 	// reset input 
 	resetInput();

 	adjust.forEach((adj,index)=>{
 		checkTextContrast(colorDivs[index].style.background,adj);
         checkTextContrast(colorDivs[index].style.background,lock[index]);  
         // console.log(initialColor );
 	});
 }

 function  colorizeSliders(color,hue,brightness,saturation){
 	// scale saturation
 	const sat=color.set('hsl.s',0);
 	const fullsat=color.set('hsl.s',1);
 	const scaleSet=chroma.scale([sat,color,fullsat]);
 	// scale brightness
     const midbrigh=color.set('hsl.l',.5);
     const brightSet =chroma.scale(['black',midbrigh,'white']);
     // scale hue
     // const minhue=color.set('hsl.h', 0);
     //   const fullhue=color.set('hsl.h', 1);
     //   const hueset=chroma.scale([minhue,color,fullhue]);

  // update unput colors
  saturation.style.background=`linear-gradient(to right,${scaleSet(0)},${scaleSet(1)})`;
   brightness.style.background=`linear-gradient(to right,${brightSet(0)},${brightSet(0.5)},${brightSet(1)})`;
    hue.style.background=`linear-gradient(to right,green,yellow,orange,red,pink,violet,blue`;
 }




 // hsl controls fuction 
 function hslControls(e){
 	// console.log(e);
     const index=e.target.dataset.hue ||
      e.target.dataset.bright ||
      e.target.dataset.sat;
       // console.log(index);
       

       // get sliders
       let sliders=e.target.parentElement.querySelectorAll('input[type="range"]');
       // console.log(sliders);
       const hue =sliders[0];
       const brightness=sliders[1];
       const saturation=sliders[2];
             

 		// setting the colors
             const bgcolor =initialColor[index];
             // console.log(color);
              let color=chroma(bgcolor)
  				.set('hsl.s',saturation.value)
  				.set('hsl.l',brightness.value)
  				.set('hsl.h',hue.value);

  				colorDivs[index].style.background=color;
  				
  				// currenthexes[index].innerText=color;
  				// colorize inputs
  				colorizeSliders(color,hue,brightness,saturation);

           
 }

		 // updateUi function
		 function updateUi(index){
		 	const currentdiv=colorDivs[index];
		    const  color =chroma(currentdiv.style.backgroundColor);
		    // console.log(color);
		    const texthex=currentdiv.querySelector('h2');
		    const icons=currentdiv.querySelectorAll('.controls button');
		    texthex.innerText=color.hex();
		    // console.log(color.hex());
		    checkTextContrast(color,texthex);
		    for (icon of icons){
		    	checkTextContrast(color,icon);
		    }

		 }




		 // reset input function
		 function resetInput(){
		 	const sliders=document.querySelectorAll('.sliders input');
		 	 sliders.forEach(slider =>{
               if(slider.name=='hue'){
               	const hueColor=initialColor[slider.getAttribute('data-hue')];
               	// console.log(hueColor);
               	const hueValue=chroma(hueColor).hsl()[0];
               	slider.value=Math.floor(hueValue);
               }
               else if(slider.name=='brightness'){
               	const hueColor=initialColor[slider.getAttribute('data-bright')];
               	// console.log(hueColor);
               	const hueValue=chroma(hueColor).hsl()[2];
               	slider.value=Math.floor(hueValue * 100)/100;
               }
               else{
               	const hueColor=initialColor[slider.getAttribute('data-sat')];
               	// console.log(hueColor);
               	const hueValue=chroma(hueColor).hsl()[1];
               	slider.value=Math.floor(hueValue *100)/100;
               }
		 	 });
		 }



 // copy to clip board function
		 function copyToClipBoard(hex){
		 	// ===========================
            const el =document.createElement('textarea');
            el.value=hex.innerText;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);

            // // adding popup  animation
             const popBox=popup.children[0];
             popup.classList.add('active');
             popBox.classList.add('active');
             // console.log(popBox);
           
		 }




		 function opensliders(index){
		 	// console.log(sliderhold);
		 	sliderhold[index].classList.toggle('active');

		 }
       

       function closeSliders(index){
       		sliderhold[index].classList.remove('active');

       }
 		// implements to local storage
 		const save=document.querySelector('.save');
 		const submit=document.querySelector('.submit-save');
 		const submitclose=document.querySelector('.close-save');
 		const  saveContainer=document.querySelector('.save-container');
 		const saveinput=document.querySelector('.save-name');
 		const libraryBtn=document.querySelector('.library-panel .library');
        const libraryContainer=document.querySelector('.library-container');
        const closeLibrary=document.querySelector('.close-library');

         // events listeners
	 		save.addEventListener('click',openPallete)
	        submitclose.addEventListener('click',closePallete);
	        submit.addEventListener('click',savePallete);
	        libraryBtn.addEventListener('click',openlibrary);
	        closeLibrary.addEventListener('click',closeLibrarypallete)



         // functions
 		function openPallete(e){
 			const popup=saveContainer.children[0];
 			saveContainer.classList.add('active');
 			popup.classList.add('active');
 		}


 		function closePallete(e){
 			const popup=saveContainer.children[0];
 			saveContainer.classList.remove('active');
 			popup.classList.remove('active');
 		}


 		function savePallete(e){
 			const popup=saveContainer.children[0];
 			saveContainer.classList.remove('active');
 			popup.classList.remove('active');
 			const name=saveinput.value;
 			const colors=[];
 			currenthexes.forEach((hex)=>{
 			colors.push(hex.innerText);
 			}); 
 			// console.log(colors);
 				



 			// genetate object

 			let palleteNr;
 			const paletteObjects=JSON.parse(localStorage.getItem('palettes'));
 			if(paletteObjects!==null){
 				palleteNr=paletteObjects.length;
 			}else{
				palleteNr=savedPalet.length;
 			}
		    const paletteObj={name,colors,nr:palleteNr};
			savedPalet.push(paletteObj);  
				 		


 			 // save to local storage 
 	          
 		 	saveToLocal(paletteObj);
 		 	saveinput.value='';

 		 	// genrate the pallete for the library
 		 	const palette=document.createElement('div');
 		 	palette.classList.add('custom-palette');
 		 	const title=document.createElement('h4') ;
 		 	title.innerText=paletteObj.name;
 		 	const preview =document.createElement('div');
 		 	preview.classList.add('small-preview');
 		 	paletteObj.colors.forEach(smallColor=>{
 		 		const smallDiv=document.createElement('div');
 		 		smallDiv.style.background=smallColor;
 		 		preview.appendChild(smallDiv);
 		 	});
 		 	const paletteBtn=document.createElement('button');
 		 	paletteBtn.classList.add('pick-palette-btn');
 		 	paletteBtn.classList.add(paletteObj.nr);
 		 	paletteBtn.innerText='select';

 		 	// attach event to the btn
 		 	paletteBtn.addEventListener('click',e=>{
 		 		closeLibrarypallete();
 		 		const paletteIndex=e.target.classList[1];
 		 		// console.log(savedPalet[paletteIndex]);
 		 		initialColor=[];
 		 		savedPalet[paletteIndex].colors.forEach((color,index)=>{
 		 			initialColor.push(color);
 		 			colorDivs[index].style.background=color;
 		 			const text=colorDivs[index].children[0];
 		 			checkTextContrast(color,text);
 		 			updateUi(index);
 		 			
 		 		});
 		 		resetInput();
 		 	});

			// append to library
			palette.appendChild(title);
			palette.appendChild(preview);
			palette.appendChild(paletteBtn)
 		 	libraryContainer.children[0].appendChild(palette);
 		 	
         	
	 		}

	 		function openlibrary(){  
	 			    
	 		 		const popup=libraryContainer.children[0];
		 			libraryContainer.classList.add('active');
		 			popup.classList.add('active');
		 		
	 		}

	 		function closeLibrarypallete(){
	 	 		const popup=libraryContainer.children[0];
		 			libraryContainer.classList.remove('active');
		 			popup.classList.remove('active');
	 		}


        function saveToLocal(palleteobj){
       let localPalette;
       if(localStorage.getItem('palettes') ===null){
      localPalette=[];
  }
		else{
       	 	localPalette=JSON.parse(localStorage.getItem('palettes'));
  }

       localPalette.push(palleteobj);
       localStorage.setItem('palettes',JSON.stringify(localPalette));


        }



        // =========================
        function getLocal(){
        let localPalette;  
         if(localStorage.getItem('palettes') ===null){
       	localPalette=[];
  			}
		 else{
       	 	const paletteObjects=JSON.parse(localStorage.getItem('palettes'));
  			savedPalet=[...paletteObjects];

  			paletteObjects.forEach(paletteObj=>{ 
  			// genrate the pallete for the library
 		 	const palette=document.createElement('div');
 		 	palette.classList.add('custom-palette');
 		 	const title=document.createElement('h4') ;
 		 	title.innerText=paletteObj.name;
 		 	const preview =document.createElement('div');
 		 	preview.classList.add('small-preview');
 		 	paletteObj.colors.forEach(smallColor=>{
 		 		const smallDiv=document.createElement('div');
 		 		smallDiv.style.background=smallColor;
 		 		preview.appendChild(smallDiv);
 		 	});
 		 	const paletteBtn=document.createElement('button');
 		 	paletteBtn.classList.add('pick-palette-btn');
 		 	paletteBtn.classList.add(paletteObj.nr);
 		 	paletteBtn.innerText='select';

 		 	// attach event to the btn
 		 	paletteBtn.addEventListener('click',e=>{
 		 		closeLibrarypallete();
 		 		const paletteIndex=e.target.classList[1];
 		 		// console.log(savedPalet[paletteIndex]);
 		 		initialColor=[];
 		 		paletteObjects[paletteIndex].colors.forEach((color,index)=>{
 		 			initialColor.push(color);
 		 			colorDivs[index].style.background=color;
 		 			const text=colorDivs[index].children[0];
 		 			checkTextContrast(color,text);
 		 			updateUi(index);
 		 			
 		 		});
 		 		
 		 		resetInput();

  });

 		// append to library
			palette.appendChild(title);
			palette.appendChild(preview);
			palette.appendChild(paletteBtn)
 		 	libraryContainer.children[0].appendChild(palette);
 		 	 
});

  			}
}
// localStorage.clear();

       	getLocal();

        RandomColors();

