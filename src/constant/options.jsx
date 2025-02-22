export const SelectTravelList = [
    {
      id: 1,
      title: "Just Me",
      desc: "A sole traveler in exploration",
      icons: "+",
      people: '1'
    },
    {
      id: 2,
      title: "A Couple",
      desc: "Two travelers in tandem",
      icons: "",
      people: '2 people'
    },
    {
      id: 3,
      title: "Friends",
      desc: "A bunch of thrill-seekers",
      icons: "",
      people: '3+ people'
    },
    {
      id: 4,
      title: "Family",
      desc: "A group of fun-loving adventurers",
      icons: "",
      people: '4+ people'
    }
  ];
  export const SelectBudgetList = [
    {
      id: 1,
      title: "Cheap",
      desc: "Stay conscious of costs",
      icons: "$",
      range: 'Under $500'
    },
    {
      id: 2,
      title: "Moderate",
      desc: "Keep cost on the average side",
      icons: "$$",
      range: '$500 - $1500'
    },
    {
      id: 3,
      title: "Luxury",
      desc: "Don't worry about cost",
      icons: "$$$",
      range: 'Over $1500'
    }
  ];

export const AI_PROMPT = `
  Plan a trip for a ${'${days}'}-day vacation to ${'${location'}}, with a budget of ${'${budget}'}.
  The traveler is planning to go with ${'${companions}'} and wants recommendations based on these details.
  Make sure to suggest activities, accommodations, and dining options that suit the budget and preferences.
`;
