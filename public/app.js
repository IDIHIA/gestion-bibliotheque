const apiUrl = '/api';

// Fonction pour récupérer les étudiants
async function getEtudiants() {
  try {
    const response = await fetch(`${apiUrl}/etudiants`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const etudiants = await response.json();
    
    const etudiantsList = document.getElementById('etudiantsList');
    if (etudiantsList) {
      etudiantsList.innerHTML = '';
      etudiants.forEach(etudiant => {
        const li = document.createElement('li');
        li.textContent = `${etudiant.nom} ${etudiant.prenom} - ${etudiant.email}`;
        etudiantsList.appendChild(li);
      });
    }

    // Remplir le select des étudiants pour les emprunts
    const empruntEtudiant = document.getElementById('empruntEtudiant');
    if (empruntEtudiant) {
      empruntEtudiant.innerHTML = '';
      etudiants.forEach(etudiant => {
        const option = document.createElement('option');
        option.value = etudiant._id;
        option.textContent = `${etudiant.nom} ${etudiant.prenom}`;
        empruntEtudiant.appendChild(option);
      });
    }
  } catch (error) {
    console.error('Error fetching students:', error);
  }
}

// Fonction pour récupérer les livres
async function getLivres() {
  try {
    const response = await fetch(`${apiUrl}/livres`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const livres = await response.json();
    
    const livresList = document.getElementById('livresList');
    if (livresList) {
      livresList.innerHTML = '';
      livres.forEach(livre => {
        const li = document.createElement('li');
        li.textContent = `${livre.titre} - ${livre.disponibilite ? 'Disponible' : 'Indisponible'}`;
        livresList.appendChild(li);
      });
    }

    // Remplir le select des livres pour les emprunts
    const empruntLivre = document.getElementById('empruntLivre');
    if (empruntLivre) {
      empruntLivre.innerHTML = '';
      livres.forEach(livre => {
        const option = document.createElement('option');
        option.value = livre._id;
        option.textContent = livre.titre;
        empruntLivre.appendChild(option);
      });
    }
  } catch (error) {
    console.error('Error fetching books:', error);
  }
}

// Fonction pour récupérer les emprunts
async function getEmprunts() {
  try {
    const response = await fetch(`${apiUrl}/empruntes`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const emprunts = await response.json();
    
    const empruntsList = document.getElementById('empruntsList');
    if (empruntsList) {
      empruntsList.innerHTML = '';
      emprunts.forEach(emprunt => {
        const li = document.createElement('li');
        li.textContent = `Emprunté par ${emprunt.etudiant.nom} ${emprunt.etudiant.prenom} du ${emprunt.dateDebut} au ${emprunt.dateFin} - Livre: ${emprunt.livre.titre}`;
        empruntsList.appendChild(li);
      });
    }
  } catch (error) {
    console.error('Error fetching loans:', error);
  }
}

// Fonction pour recharger la page après une action
function reloadPage() {
  window.location.reload();
}

// Ajouter un étudiant
document.getElementById('addEtudiantForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const etudiant = {
    nom: formData.get('nom'),
    prenom: formData.get('prenom'),
    email: formData.get('email')
  };

  try {
    const response = await fetch('/api/etudiants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(etudiant),
    });

    if (response.ok) {
      alert('Étudiant ajouté avec succès');
      reloadPage();
    } else {
      alert('Erreur lors de l\'ajout de l\'étudiant');
    }
  } catch (error) {
    console.error('Erreur:', error);
    alert('Une erreur est survenue');
  }
});

// Ajouter un livre
document.getElementById('addLivreForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const livre = {
    titre: formData.get('titre'),
    disponibilite: formData.get('disponibilite') === 'on'
  };

  try {
    const response = await fetch('/api/livres', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(livre),
    });

    if (response.ok) {
      alert('Livre ajouté avec succès');
      reloadPage();
    } else {
      alert('Erreur lors de l\'ajout du livre');
    }
  } catch (error) {
    console.error('Erreur:', error);
    alert('Une erreur est survenue');
  }
});

// Ajouter un emprunt
document.getElementById('addEmpruntForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const emprunt = {
    dateDebut: formData.get('dateDebut'),
    dateFin: formData.get('dateFin'),
    etudiant: formData.get('etudiantId'),
    livre: formData.get('livreId')
  };

  try {
    const response = await fetch('/api/empruntes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emprunt),
    });

    if (response.ok) {
      alert('Emprunt ajouté avec succès');
      reloadPage();
    } else {
      alert('Erreur lors de l\'ajout de l\'emprunt');
    }
  } catch (error) {
    console.error('Erreur:', error);
    alert('Une erreur est survenue');
  }
});

// Charger les données au chargement de la page
window.onload = async () => {
  getEtudiants();
  getLivres();
  getEmprunts();
};
