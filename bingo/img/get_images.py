
#!/usr/bin/python3
from PIL import Image

a = "A"
for i in range(1,54):
  print("<div><img src=\"img/animals/"+str(i).rjust(2, '0')+".png\" /></div>")


# count = 1
# for i in range(4,13):
#   print(str(i)+".png")
#   im = Image.open(str(i)+".png")
#   width, height = im.size
 
#   x1 = 260
#   x2 = 806
#   y1 = 184      #height-
#   y2 = 661      #height-
#   y3 = 1137     #height-

#   region = im.crop((x1, y1, x1+469, y1+469))
#   region.save("./output/"+str(count).rjust(2, '0')+".png")
#   count=count+1

#   region = im.crop((x2, y1, x2+469, y1+469))
#   region.save("output/"+str(count).rjust(2, '0')+".png")
#   count=count+1

#   region = im.crop((x1, y2,x1+469, y2+469))
#   region.save("output/"+str(count).rjust(2, '0')+".png")
#   count=count+1

#   region = im.crop((x2, y2, x2+469, y2+469))
#   region.save("output/"+str(count).rjust(2, '0')+".png")
#   count=count+1

#   region = im.crop((x1, y3,x1+469, y3+469))
#   region.save("output/"+str(count).rjust(2, '0')+".png")
#   count=count+1

#   region = im.crop((x2, y3, x2+469, y3+469))
#   region.save("output/"+str(count).rjust(2, '0')+".png")
#   count=count+1
