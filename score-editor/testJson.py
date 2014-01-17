# -*-coding:Latin-1 -*

""" Module de test Json """

import os
import io
import json
from classeProject import *
from serialiseurJson import *

note1 = Note("ka", 20, "aigu")
title = Title("Arial", 14, "blanc", "normal")
template = Template(True, "Kinko", 20, False, False)
piste1 = Piste(template, title)
piste1.notes.append(note1)
partition = Partition(title, "Test", "17-01-14", 1)
partition.pistes.append(piste1)

with open('Test.json', 'w') as f:
    json.dump(partition, f, indent=4, default=serialiseur_perso)

os.system("pause")