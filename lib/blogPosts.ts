export const blogPosts = [
  {
    slug: "property-buying-checklist",
    title: "Property Buying Checklist in Pakistan: Documents, Location, and Price Verification",
    category: "Buying Guide",
    date: "April 28, 2026",
    image: "/images/one.jpg",
    excerpt:
      "Use this property buying checklist in Pakistan to verify ownership documents, society approvals, location value, utilities, taxes, and market price before making a payment.",
    content: [
      {
        heading: "Verify property ownership documents first",
        body: "Before buying a house, apartment, plot, or commercial property in Pakistan, start with document verification. Review the ownership papers, transfer history, allotment letter, possession certificate, tax records, society approval, and any mortgage or dispute status. A property that is not legally clear can create delays, financial loss, or transfer problems later.",
      },
      {
        heading: "Inspect the location and surrounding development",
        body: "Visit the property in person and evaluate the street, access roads, water, electricity, gas, drainage, parking, security, nearby markets, schools, hospitals, and public transport. Online property listings are helpful for shortlisting, but a physical visit gives a more accurate view of the location and neighborhood quality.",
      },
      {
        heading: "Compare the asking price with market value",
        body: "Check similar properties for sale in the same city, sector, phase, or housing society before finalizing the price. If the demand is much lower than the market, investigate the reason carefully. Always keep written receipts for token money and avoid cash payments without proper documentation.",
      },
      {
        heading: "Use professional help before signing",
        body: "Before signing a sale agreement, consult a trusted property lawyer, documentation expert, or reliable real estate advisor. Easy Raabta helps buyers discover property listings, but final legal and financial verification should always be completed before payment or transfer.",
      },
    ],
  },
  {
    slug: "home-renting-checklist",
    title: "Home Renting Checklist: What Tenants Should Confirm Before Moving In",
    category: "Rental Tips",
    date: "April 28, 2026",
    image: "/images/Islamabadd.jpg",
    excerpt:
      "A practical home renting checklist for tenants covering rent agreement terms, security deposit, maintenance, utilities, notice period, and property inspection.",
    content: [
      {
        heading: "Review rent agreement terms clearly",
        body: "Before renting a house, apartment, portion, or flat, confirm the monthly rent, security deposit, advance rent, agreement duration, renewal terms, rent increase policy, and notice period. These terms should be written in the rental agreement so both tenant and landlord understand their responsibilities.",
      },
      {
        heading: "Inspect utilities, condition, and maintenance",
        body: "Check water pressure, electricity load, gas availability, seepage, doors, windows, bathroom fittings, kitchen condition, parking, internet access, and building charges. A careful inspection before moving in helps avoid disputes after possession.",
      },
      {
        heading: "Clarify repair responsibilities",
        body: "Ask who will handle small repairs, major maintenance, plumbing issues, electrical work, appliance faults, and shared building expenses. Clear maintenance terms are especially important for apartments, upper portions, and shared houses.",
      },
      {
        heading: "Keep records of payments and documents",
        body: "Keep copies of the signed rent agreement, landlord details, payment receipts, meter readings, and handover notes. Proper records protect tenants and landlords if there is any disagreement about rent, deposit return, or property condition.",
      },
    ],
  },
  {
    slug: "dealer-listing-tips",
    title: "Real Estate Dealer Listing Tips: How to Get More Genuine Property Inquiries",
    category: "Dealer Tips",
    date: "April 28, 2026",
    image: "/images/rwalpindi.jpg",
    excerpt:
      "Improve your property listings with clear photos, accurate city and area details, complete pricing, strong descriptions, and fast responses to buyer and tenant inquiries.",
    content: [
      {
        heading: "Add complete property information",
        body: "A professional real estate listing should include the exact city, area, property type, price, size, bedrooms, bathrooms, address details, contact number, and purpose such as sale or rent. Complete listings build trust and attract more serious buyers and tenants.",
      },
      {
        heading: "Use real photos that show the property clearly",
        body: "Upload bright, real, and recent photos of the front elevation, rooms, kitchen, bathrooms, street, parking, and key features. Avoid misleading images or unrelated photos because they reduce trust and can waste time for both dealers and customers.",
      },
      {
        heading: "Write a searchable and honest description",
        body: "Use clear keywords that people search for, such as house for sale, apartment for rent, residential plot, commercial shop, office space, or farmhouse. Mention location benefits, nearby facilities, access roads, possession status, and any important terms without exaggeration.",
      },
      {
        heading: "Respond quickly and keep listings updated",
        body: "Fast replies can convert property inquiries into visits. If a property is sold, rented, price-changed, or unavailable, update the listing immediately. Accurate and fresh listings improve the dealer profile and create a better user experience on Easy Raabta.",
      },
    ],
  },
  {
    slug: "residential-vs-commercial-plots",
    title: "Residential vs Commercial Plots: Key Differences for Property Investment",
    category: "Investment",
    date: "April 28, 2026",
    image: "/images/two.jpg",
    excerpt:
      "Compare residential and commercial plots by zoning, location demand, development status, transfer costs, rental potential, and long-term resale value.",
    content: [
      {
        heading: "Understand the purpose of each plot type",
        body: "Residential plots are usually purchased for building a home or for long-term capital growth. Commercial plots are designed for shops, offices, plazas, or business use. The right option depends on your budget, investment goal, holding period, and risk tolerance.",
      },
      {
        heading: "Check zoning, approvals, and permitted use",
        body: "Before buying any plot, confirm whether it is approved for residential or commercial use by the relevant authority or housing society. Using a residential plot for commercial activity without approval can create legal and financial problems.",
      },
      {
        heading: "Compare location demand and development status",
        body: "For residential plots, nearby schools, parks, security, utilities, and family facilities matter. For commercial plots, visibility, road width, parking, foot traffic, and surrounding business activity are more important. Development status and possession also affect resale value.",
      },
      {
        heading: "Calculate total investment cost",
        body: "Look beyond the asking price. Include transfer fees, development charges, taxes, construction rules, possession charges, and any society dues. A plot with a lower price may not be the better investment if extra charges or delayed development reduce its value.",
      },
    ],
  },
];

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
