from fitz import fitz, Rect
import random
import PyPDF2 as pdf2

num_sheets = 200

w = 43
h = 43

X_grid_positions = [    48-48,    346-48,   56-48,  346-48 ]
Y_grid_positions = [    124-124,   123-124,  516-124,  512-124 ]

X_positions = [ 48, 94, 141, 186, 231 ]
Y_positions = [ 124, 172, 217, 263, 309 ]


s_list = []
for i in range(num_sheets):
    s_item = random.sample(range(1, 55), 25 )
    #print(s_item)
    if( s_item in s_list) :
        print ("Element Exists")
    else:
        s_list.append(s_item)

# for i in s_list:
#     print(s_list.index(i), i)

doc = fitz.open("Temp.pdf")

def add_footer(pdf):
    doc2 = fitz.open()                 # new empty PDF
    for s_count in range(int(len(s_list)/4)):
        doc2.insert_pdf(pdf, from_page=0, to_page=0)
        # img = open("./animals/06.png", "rb").read()
        for g in range(4):
            count=0
            print(s_count*4+g, s_list[s_count*4+g])
            for x1 in X_positions:
                for y1 in Y_positions:
                    # print(x1, y1, x1+w, y1+h)
                    rect = fitz.Rect(X_grid_positions[g]+x1, Y_grid_positions[g]+y1, X_grid_positions[g]+x1+w, Y_grid_positions[g]+y1+h)
                    page = doc2[s_count]
                    page.clean_contents()
                    page.insert_image(rect, filename="./animals/"+str(s_list[s_count*4+g][count]).rjust(2, '0')+".png")
                    count+=1
    doc2.save('Bingo_sheets.pdf')  

add_footer(doc)
