import { ID } from "react-native-appwrite";
import { appwriteConfig, databases } from "./appwrite";
import dummyData from "./data";

/* =======================
  Types
======================= */
interface Category {
  name: string;
  description: string;
}

interface Customization {
  name: string;
  price: number;
  type: "topping" | "side" | "size" | "crust" | string;
}

interface MenuItem {
  name: string;
  description: string;
  image_url: string; // ✅ URL เท่านั้น
  price: number;
  rating: number;
  calories: number;
  protein: number;
  category_name: string;
  customizations: string[];
}

interface DummyData {
  categories: Category[];
  customizations: Customization[];
  menu: MenuItem[];
}

const data = dummyData as DummyData;

/* =======================
  Utils
======================= */
async function clearAll(collectionId: string): Promise<void> {
  const list = await databases.listDocuments(
    appwriteConfig.databaseId,
    collectionId
  );

  if (list.documents.length === 0) {
    console.log(`ℹ️ Collection already empty: ${collectionId}`);
    return;
  }

  await Promise.all(
    list.documents.map((doc) =>
      databases.deleteDocument(
        appwriteConfig.databaseId,
        collectionId,
        doc.$id
      )
    )
  );

  console.log(`🗑️ Cleared collection: ${collectionId}`);
}

/* =======================
  Seed
======================= */
async function seed(): Promise<void> {
  try {
    console.log("🌱 ===== Start Seeding (IMAGE URL MODE) =====");

    /* 1️⃣ Clear data */
    console.log("🚮 Clearing existing data...");
    await clearAll(appwriteConfig.categoriesCollectionId);
    await clearAll(appwriteConfig.customizationsCollectionId);
    await clearAll(appwriteConfig.menuCollectionId);
    await clearAll(appwriteConfig.menuCustomizationCollectionId);

    /* 2️⃣ Categories */
    console.log("📂 Seeding categories...");
    const categoryMap: Record<string, string> = {};

    for (const cat of data.categories) {
      const doc = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.categoriesCollectionId,
        ID.unique(),
        cat
      );

      categoryMap[cat.name] = doc.$id;
      console.log(`✅ Category created: ${cat.name}`);
    }

    /* 3️⃣ Customizations */
    console.log("🧩 Seeding customizations...");
    const customizationMap: Record<string, string> = {};

    for (const cus of data.customizations) {
      const doc = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.customizationsCollectionId,
        ID.unique(),
        {
          name: cus.name,
          price: cus.price,
          type: cus.type,
        }
      );

      customizationMap[cus.name] = doc.$id;
      console.log(`✅ Customization created: ${cus.name}`);
    }

    /* 4️⃣ Menu + Relation */
    console.log("🍔 Seeding menu items...");

    for (const item of data.menu) {
      console.log(`➡️ Creating menu: ${item.name}`);

      const menuDoc = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.menuCollectionId,
        ID.unique(),
        {
          name: item.name,
          description: item.description,
          image_url: item.image_url, // ✅ ใช้ URL ตรง ๆ
          price: item.price,
          rating: item.rating,
          calories: item.calories,
          protein: item.protein,
          categories: categoryMap[item.category_name],
        }
      );

      console.log(`✅ Menu created: ${item.name}`);

      for (const cusName of item.customizations) {
        const customizationId = customizationMap[cusName];

        if (!customizationId) {
          console.warn(
            `⚠️ Customization not found: ${cusName} (menu: ${item.name})`
          );
          continue;
        }

        await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.menuCustomizationCollectionId,
          ID.unique(),
          {
            menu: menuDoc.$id,
            customizations: customizationId,
          }
        );

        console.log(
          `🔗 Linked "${item.name}" → customization "${cusName}"`
        );
      }
    }

    console.log("🎉 ===== Seeding completed successfully =====");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  }
}

export default seed;
