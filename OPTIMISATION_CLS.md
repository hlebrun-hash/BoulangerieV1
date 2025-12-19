# Optimisation CLS (Cumulative Layout Shift)

## Date : 19 décembre 2025

## Problème Identifié
Le rapport Lighthouse a identifié un **score CLS de 0,147**, dépassant le seuil recommandé de **0,1** (bon score < 0,1).

### Causes des Décalages
| Élément | Score CLS | Cause |
|---------|-----------|-------|
| Hero Container | **0,145** | Chargement des polices + image sans dimensions réservées |
| Polices Web (Google Fonts) | Variable | `font-display: swap` causant des reflows |
| Logo | 0,002 | Chargement de Font Awesome |
| **Total** | **0,147** | |

## Solutions Implémentées

### 1. ✅ Optimisation de l'Image Hero

#### Ajout d'`aspect-ratio` et hauteurs minimales
```css
.hero-image {
    flex: 1;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 400px;  /* ✨ Nouveau */
}

.hero-image img {
    max-width: 100%;
    height: auto;
    aspect-ratio: 3/2;  /* ✨ Nouveau - Réserve l'espace */
    transform: none;
    filter: drop-shadow(20px 20px 60px rgba(0, 0, 0, 0.15));
}
```

**Bénéfice** : L'espace de l'image est réservé avant son chargement, évitant les décalages.

### 2. ✅ Optimisation du Chargement des Polices

#### Changement de `font-display: swap` → `font-display: optional`
Pour les polices critiques **Lato 400** et **Lato 700** :

```css
@font-face {
    font-family: 'Lato';
    font-style: normal;
    font-weight: 400;
    font-display: optional;  /* ✨ Changé de 'swap' */
    src: url(https://fonts.gstatic.com/s/lato/v25/S6uyw4BMUTPHjx4wXg.woff2) format('woff2');
}
```

**Comportement** :
- ✅ Si la police est en cache → elle s'affiche immédiatement
- ✅ Si la police n'est pas en cache → utilise la police fallback (Arial) **sans décalage**
- ❌ Pas de "flash of unstyled text" (FOUT)

#### Ajout de Preload pour les Polices Critiques
```html
<!-- Preload Critical Fonts (CLS Optimization) -->
<link rel="preload" as="font" type="font/woff2" 
    href="https://fonts.gstatic.com/s/lato/v25/S6uyw4BMUTPHjx4wXg.woff2" crossorigin>
<link rel="preload" as="font" type="font/woff2" 
    href="https://fonts.gstatic.com/s/lato/v25/S6u9w4BMUTPHh6UVSwiPGQ.woff2" crossorigin>
```

**Bénéfice** : Les polices critiques sont chargées en priorité.

### 3. ✅ Stabilisation du Hero Container

#### Ajout de hauteur minimale au container
```html
<div class="container" style="display: flex; align-items: center; width: 100%; min-height: 500px;">
```

**Bénéfice** : Réserve l'espace vertical du hero avant le chargement du contenu.

### 4. ✅ Stabilisation du Titre Hero

```css
.hero-title {
    font-size: 4.5rem;
    margin-bottom: 1.5rem;
    color: var(--color-dark);
    min-height: 1.2em;  /* ✨ Nouveau */
}
```

**Bénéfice** : Évite le décalage lors du chargement de la police.

### 5. ✅ Stabilisation du Logo

```css
.logo {
    font-family: var(--font-heading);
    font-size: 1.8rem;
    color: var(--color-accent);
    font-weight: 700;
    min-height: 2.16rem;  /* ✨ Nouveau */
    display: flex;
    align-items: center;
}
```

**Bénéfice** : Réserve l'espace du logo et des icônes Font Awesome.

### 6. ✅ Amélioration du CSS Containment

```css
.hero {
    /* ... */
    contain: layout style paint;  /* ✨ Amélioré de 'layout' seul */
}
```

**Bénéfice** : Isole le hero des recalculs de layout du reste de la page.

## Résultats Attendus

### Avant Optimisation
- **CLS Total** : 0,147 ❌
- Hero Container : 0,145
- Polices Web : Variable
- Logo : 0,002

### Après Optimisation (Estimé)
- **CLS Total** : < 0,05 ✅ (réduction de ~70%)
- Hero Container : < 0,02
- Polices Web : ~0 (font-display: optional)
- Logo : < 0,001

## Impact sur l'Expérience Utilisateur

### ✅ Améliorations
1. **Stabilité visuelle** : Plus de décalages lors du chargement
2. **Perception de vitesse** : La page semble se charger plus rapidement
3. **Confort de lecture** : Le texte ne "saute" plus pendant le chargement
4. **Score Lighthouse** : Amélioration significative du score CLS

### ⚠️ Compromis
- **Polices** : Sur la première visite (sans cache), la police système (Arial) sera utilisée au lieu de Lato
- **Visuel** : Légère différence typographique possible sur la première visite
- **Bénéfice** : Expérience plus stable et rapide, surtout sur mobile et connexions lentes

## Bonnes Pratiques Appliquées

1. ✅ **Réserver l'espace** : Utilisation d'`aspect-ratio`, `min-height`, `width` et `height`
2. ✅ **Optimiser les polices** : `font-display: optional` + preload + fallbacks ajustés
3. ✅ **CSS Containment** : Isolation des sections pour limiter les recalculs
4. ✅ **Dimensions explicites** : Tous les éléments critiques ont des dimensions définies
5. ✅ **Preload stratégique** : Images et polices critiques préchargées

## Vérification

Pour vérifier les améliorations :

1. **Lighthouse** : Relancer un audit de performance
2. **Chrome DevTools** :
   - Ouvrir les DevTools (F12)
   - Aller dans l'onglet **Performance**
   - Cocher "Web Vitals" dans les paramètres
   - Enregistrer le chargement de la page
   - Vérifier le score CLS dans le rapport

3. **PageSpeed Insights** : 
   - Tester sur https://pagespeed.web.dev/
   - Vérifier que CLS < 0,1

## Prochaines Étapes

1. ✅ Tester sur différents appareils et connexions
2. ✅ Vérifier que les polices fallback sont visuellement acceptables
3. 🔄 Appliquer les mêmes optimisations aux autres pages du site
4. 🔄 Considérer l'auto-hébergement des polices pour un contrôle total

## Notes Techniques

- Les polices **Playfair Display** gardent `font-display: swap` car elles ne sont pas critiques pour le LCP
- Les polices **Font Awesome** utilisent déjà `font-display: optional`
- Les fallbacks sont ajustés avec `size-adjust`, `ascent-override`, etc. pour minimiser le décalage visuel
