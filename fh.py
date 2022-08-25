f = open('z8.json', 'r')
g = open('z81.json', 'w')
for x in range(12197):
    g.write(f.readline()[:-1]+","+"\n")
    # print(x)
f.close()
g.close()
