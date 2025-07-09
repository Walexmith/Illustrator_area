# Illustrator_area
## _Un script pour calculer les aires de formes complexes dans Illustrator_

### Fonctionnement
1. un carré de 100x100mm

<img src="https://github.com/user-attachments/assets/9c963c98-65fe-4799-853e-2a8bc0d1ae04" height="300" />

2. Avec le carré séléctionné, le script est lancé

<img src="https://github.com/user-attachments/assets/699c3221-a5f1-4525-922b-075e7fc27378" height="300" />

_un dialogue demande d'indiquer l'échelle du dessin. Par defaut, 1:1_

3. Le script ouvre un second dialogue indiquant les informations d'aire en mm² et m²
   
   <img src="https://github.com/user-attachments/assets/981ffcd4-9acc-4cce-8388-945ccfbcf0c2" height="300" />

5. Le script crée un calque dédié, nommé Surfaces
   
   <img src="https://github.com/user-attachments/assets/47eba0f1-2698-4de4-9faa-0e3e19950f7c" height="300" />

6. Le script crée une zone de texte en haut à droite de l'objet mesuré et y colle les données d'aire de l'objet
   
   <img src="https://github.com/user-attachments/assets/4f12cc70-2b78-4a1c-903c-e8a569b9ee82" height="300" />

7. Le script fonctionne avec des tracés transparents (compound paths) et soustrait les _trous_
   
    <img src="https://github.com/user-attachments/assets/33c45f1d-f392-478f-8a44-a11bf1873a1e" height="300" />

8. **Le script fonctionne également avec plusieurs objets sélectionnés**
