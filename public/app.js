const apiUrl = 'http://localhost:5000/api';

// Fonction pour récupérer les étudiants
async function getEtudiants() {
  const response = await fetch(`${apiUrl}/etudiants`);
  const etudiants = await response.json();
  const etudiantsList = document.getElementById('etudiantsList');
  etudiantsList.innerHTML = '';
  etudiants.forEach(etudiant => {
    const li = document.createElement('li');
    li.textContent = `${etudiant.nom} ${etudiant.prenom} - ${etudiant.email}`;
    etudiantsList.appendChild(li);
  });

  // Remplir le select des étudiants pour les emprunts
  const empruntEtudiant = document.getElementById('empruntEtudiant');
  empruntEtudiant.innerHTML = '';  // On vide le select avant de le remplir
  etudiants.forEach(etudiant => {
    const option = document.createElement('option');
    option.value = etudiant._id;  // Assure-toi que tu as bien un champ _id
    option.textContent = `${etudiant.nom} ${etudiant.prenom}`;
    empruntEtudiant.appendChild(option);
  });
}

// Fonction pour récupérer les livres
async function getLivres() {
  const response = await fetch(`${apiUrl}/livres`);
  const livres = await response.json();
  const livresList = document.getElementById('livresList');
  livresList.innerHTML = '';
  livres.forEach(livre => {
    const li = document.createElement('li');
    li.textContent = `${livre.titre} - ${livre.disponibilite ? 'Disponible' : 'Indisponible'}`;
    livresList.appendChild(li);
  });

  // Remplir le select des livres pour les emprunts
  const empruntLivre = document.getElementById('empruntLivre');
  empruntLivre.innerHTML = '';  // On vide le select avant de le remplir
  livres.forEach(livre => {
    const option = document.createElement('option');
    option.value = livre._id;  // Assure-toi que tu as bien un champ _id
    option.textContent = livre.titre;
    empruntLivre.appendChild(option);
  });
}

// Fonction pour récupérer les emprunts
async function getEmprunts() {
  const response = await fetch(`${apiUrl}/empruntes`);
  const emprunts = await response.json();
  const empruntsList = document.getElementById('empruntsList');
  empruntsList.innerHTML = '';
  emprunts.forEach(emprunt => {
    const li = document.createElement('li');
    li.textContent = `Emprunté par ${emprunt.etudiant.nom} ${emprunt.etudiant.prenom} du ${emprunt.dateDebut} au ${emprunt.dateFin} - Livre: ${emprunt.livre.titre}`;
    empruntsList.appendChild(li);
  });
}

// Ajouter un étudiant
document.getElementById('addEtudiantForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const nom = document.getElementById('etudiantNom').value;
  const prenom = document.getElementById('etudiantPrenom').value;
  const email = document.getElementById('etudiantEmail').value;
  const etudiant = { nom, prenom, email };

  const response = await fetch(`${apiUrl}/etudiants`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(etudiant),
  });

  if (response.ok) {
    alert('Étudiant ajouté avec succès');
    getEtudiants();  // Recharger la liste des étudiants
  } else {
    alert('Erreur lors de l\'ajout de l\'étudiant');
  }
});

// Ajouter un livre
document.getElementById('addLivreForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const titre = document.getElementById('livreTitre').value;
  const disponibilite = document.getElementById('livreDisponibilite').checked;
  const livre = { titre, disponibilite };

  const response = await fetch(`${apiUrl}/livres`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(livre),
  });

  if (response.ok) {
    alert('Livre ajouté avec succès');
    getLivres();  // Recharger la liste des livres
  } else {
    alert('Erreur lors de l\'ajout du livre');
  }
});

// Ajouter un emprunt
document.getElementById('addEmpruntForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const dateDebut = document.getElementById('dateDebut').value;
  const dateFin = document.getElementById('dateFin').value;
  const etudiantId = document.getElementById('empruntEtudiant').value;
  const livreId = document.getElementById('empruntLivre').value;
  const emprunt = { dateDebut, dateFin, etudiant: etudiantId, livre: livreId };

  const response = await fetch(`${apiUrl}/empruntes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(emprunt),
  });

  if (response.ok) {
    alert('Emprunt ajouté avec succès');
    getEmprunts();  // Recharger la liste des emprunts
  } else {
    alert('Erreur lors de l\'ajout de l\'emprunt');
  }
});

// Charger les données au chargement de la page
window.onload = async () => {
  getEtudiants();
  getLivres();
  getEmprunts();
};
