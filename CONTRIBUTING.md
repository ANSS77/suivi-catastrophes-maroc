# Contributing

Merci de votre intérêt pour contribuer à ce projet !

## Processus de développement

### 1. Cloner le projet

```bash
git clone https://github.com/ANSS77/suivi-catastrophes-maroc.git
cd suivi-catastrophes-maroc
```

### 2. Créer une branche

```bash
git checkout -b feature/nom-de-la-fonctionnalite
# ou
git checkout -b fix/nom-du-bug
```

### 3. Faire vos modifications

- Écrivez du code propre et documenté
- Suivez les conventions de nommage existantes
- Ajoutez des tests pour les nouvelles fonctionnalités

### 4. Commits

```
feat: ajouter la page de statistiques
fix: corriger la pagination des utilisateurs
docs: mettre à jour le README
test: ajouter des tests pour le collecteur
```

### 5. Pull Request

1. Push votre branche
2. Créez une Pull Request vers `dev`
3. Décrivez vos modifications

## Tests

```bash
# Backend
cd backend
python manage.py test

# Frontend
cd frontend
npm test
```

## Signalement de bugs

Utilisez les issues GitHub pour signaler des bugs.
