For some thumbnails you want to show the user multiple versions when he/she hovers over it.
This script does exactly that. No extra plugin required. plain javascript.

Tutorial:

1. create multiple versions of thumbs. Name them in the following way:
   primary image: {imagename}.{extension}
   second version {imagename}-1.{extension}
   third version  {imagename}-2.{extension}
   etc...  
1. include script. 
2. assign class thumb_switcher to each img you want to have switching images.
3. to have different switch speed use data-thumb-switch-speed
4. are you images on a different domain use data-thumb-host={host}

The script contains all the logic to handle all situations when a particular image does not exist. 


```html
<div style="width:200px; height:100px;">
<img class="thumb_switcher" src="image1.jpg" data-thumb-switch-speed="2000">
</div>

<div style="width:200px; height:100px;">
<img class="thumb_switcher" src="image2" data-thumb-switch-speed="100">
</div>

<div style="width:200px; height:100px;">
<img class="thumb_switcher" src="image3" data-thumb-switch-speed="700">
</div>
```
'''html


'''
