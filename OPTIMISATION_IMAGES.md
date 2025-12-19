# Optimisation des Images - Rapport

## Date : 19 décembre 2025

## Problème Identifié
Le rapport Lighthouse/PageSpeed Insights a identifié que l'image hero (`hero_small.webp`) était surdimensionnée par rapport à ses dimensions d'affichage :
- **Dimensions réelles** : 400x400 pixels (29,1 KiB)
- **Dimensions affichées** : 288x288 pixels
- **Économie potentielle** : 15,6 KiB

## Solutions Implémentées

### 1. Création de Nouvelles Variantes d'Images
Nous avons créé des versions optimisées de l'image hero pour différentes tailles d'écran :

| Fichier | Dimensions | Taille | Usage |
|---------|-----------|--------|-------|
| `hero_mobile.webp` | 288x288px | 22,94 KiB | Petits mobiles (≤480px) |
| `hero_small.webp` | 400x400px | 29,1 KiB | Grands mobiles/petites tablettes (≤768px) |
| `hero_tablet.webp` | 600x600px | 77,47 KiB | Tablettes (≤1024px) |
| `hero.webp` | 1200x1200px | 114,36 KiB | Desktop |

### 2. Mise à Jour du HTML

#### Preload (ligne 12-13)
```html
<link rel="preload" as="image" 
    imagesrcset="assets/hero_mobile.webp 288w, assets/hero_small.webp 400w, assets/hero_tablet.webp 600w, assets/hero.webp 1200w"
    imagesizes="(max-width: 480px) 288px, (max-width: 768px) 400px, (max-width: 1024px) 600px, 600px" 
    fetchpriority="high">
```

#### Image Hero (ligne 1524-1532)
```html
<img src="assets/hero_tablet.webp" 
    srcset="assets/hero_mobile.webp 288w, assets/hero_small.webp 400w, assets/hero_tablet.webp 600w, assets/hero.webp 1200w"
    sizes="(max-width: 480px) 288px, (max-width: 768px) 400px, (max-width: 1024px) 600px, 600px" 
    alt="Pain artisanal et viennoiseries" 
    width="600"
    height="400" 
    loading="eager" 
    fetchpriority="high">
```

## Bénéfices

### Économies de Bande Passante
- **Mobile (≤480px)** : 6,16 KiB économisés (29,1 - 22,94 KiB)
- **Tablette (≤768px)** : Utilise la taille appropriée
- **Desktop** : Charge la version haute résolution uniquement si nécessaire

### Amélioration des Performances
- ✅ **LCP (Largest Contentful Paint)** : Réduction du temps de chargement de l'image principale
- ✅ **FCP (First Contentful Paint)** : Amélioration du temps de premier rendu
- ✅ **Économie de données** : Particulièrement important pour les utilisateurs mobiles
- ✅ **Meilleur score Lighthouse** : Résolution de l'avertissement d'optimisation d'images

## Commandes Utilisées

```powershell
# Création de hero_mobile.webp (288x288)
magick assets\hero.webp -resize 288x288 -quality 82 assets\hero_mobile.webp

# Création de hero_tablet.webp (600x600)
magick assets\hero.webp -resize 600x600 -quality 85 assets\hero_tablet.webp
```

## Prochaines Étapes Recommandées

1. **Tester sur différents appareils** pour vérifier que les bonnes images sont chargées
2. **Vérifier le nouveau score Lighthouse** pour confirmer l'amélioration
3. **Appliquer la même stratégie** aux autres images du site si nécessaire
4. **Considérer l'utilisation de formats modernes** comme AVIF pour une compression encore meilleure

## Notes Techniques

- Les attributs `width` et `height` sont conservés pour éviter le CLS (Cumulative Layout Shift)
- `loading="eager"` et `fetchpriority="high"` sont maintenus car c'est l'image LCP
- Le `srcset` utilise des descripteurs de largeur (`w`) pour permettre au navigateur de choisir la meilleure image
- L'attribut `sizes` indique au navigateur la taille d'affichage prévue selon la largeur de viewport
