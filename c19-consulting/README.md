# C19 Consulting

Site vitrine de C19 Consulting — un seul fichier HTML statique, sans framework, sans build.

## Structure

```
index.html        → le site entier (HTML + CSS + JS)
images/           → tes photos (voir images/README.md pour les noms de fichiers)
```

## Mise en ligne (une seule fois)

1. Pusher ce repo sur GitHub.
2. Sur vercel.com : **Add New → Project** → importer le repo → preset **Other** → **Deploy**.
3. **Project → Settings → Domains** → ajouter le domaine, puis copier les valeurs DNS
   fournies par Vercel dans Squarespace Domains (un enregistrement `A` sur `@`,
   un `CNAME` sur `www` vers `cname.vercel-dns.com`).

## Faire ses mises à jour — 100% clickable, zéro terminal

Tout se passe sur **github.com**, dans le navigateur. Chaque commit redéploie
automatiquement le site sur Vercel en ~30 secondes.

**Ajouter / changer une photo**
1. Ouvrir le dossier `images/` sur GitHub.
2. Cliquer **Add file → Upload files**.
3. Glisser-déposer la photo (avec le bon nom de fichier, voir `images/README.md`).
4. Cliquer **Commit changes**. C'est en ligne.

Pour remplacer une photo existante : uploader un fichier avec le même nom, il écrase l'ancien.

**Modifier un texte, un projet, un lien**
1. Ouvrir `index.html` sur GitHub.
2. Cliquer l'icône **crayon** (Edit this file).
3. `Ctrl/Cmd + F` pour trouver le texte à changer — les projets sont tous dans le
   bloc `const collection = { ... }` en bas du fichier (titre, client, année,
   services, lieu, statut, description).
4. **Commit changes**. En ligne.

**Ajouter un nouveau projet**
Dans `const collection`, copier un bloc existant (de `'p-xxx': {` jusqu'à `},`),
changer le slug, remplir les champs, et déposer l'image `images/xxx.jpg`.
La grille Work et la fiche projet se génèrent automatiquement.

## À venir

- Liens Instagram / LinkedIn / email définitifs
- Version FR (le toggle EN — FR du header est cosmétique pour l'instant)
