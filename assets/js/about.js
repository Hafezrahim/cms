document.addEventListener('DOMContentLoaded', () => {
    // Load team members (could be from Google Sheets)
    const teamContainer = document.getElementById('teamContainer');
    
    const teamMembers = [
      {
        name: "Mohamed Hafez",
        position: "CEO & Founder",
        image: "assets/img/team1.jpg",
        bio: "Experienced entrepreneur with 10+ years in web development."
      },
      {
        name: "Ahmed Ali",
        position: "CTO",
        image: "assets/img/team2.jpg",
        bio: "Technology expert specializing in CMS solutions."
      },
      {
        name: "Sarah Mohamed",
        position: "UX Designer",
        image: "assets/img/team3.jpg",
        bio: "Creative designer focused on user experience."
      },
      {
        name: "Youssef Ibrahim",
        position: "Developer",
        image: "assets/img/team4.jpg",
        bio: "Full-stack developer with CMS expertise."
      }
    ];
    
    teamContainer.innerHTML = teamMembers.map(member => `
      <div class="col-md-3 col-sm-6">
        <div class="team-member">
          <img src="${member.image}" alt="${member.name}" class="img-fluid">
          <h4>${member.name}</h4>
          <p class="text-primary">${member.position}</p>
          <p>${member.bio}</p>
        </div>
      </div>
    `).join('');
  });