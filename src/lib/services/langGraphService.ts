import  { Client } from "@langchain/langgraph-sdk";

/**
 * A minimal client for streaming data from LangGraph.
 */
export class LangGraphClient {
  private apiUrl: string;
  private graphName: string;
  private client: Client;

  /**
   * Create a new LangGraphClient.
   * @param {Object} options - Configuration options
   * @param {string} options.apiUrl - API URL (default: "http://localhost:2024")
   * @param {string} options.graphName - Graph name (default: "default")
   */
  constructor(options: { apiUrl?: string; graphName?: string } = {}) {
    this.apiUrl = options.apiUrl || "http://localhost:2024";
    this.graphName = options.graphName || "agent";
    this.client = new Client({ apiUrl: this.apiUrl });
  }

  /**
   * Stream output from LangGraph.
   * @param {Record<string, unknown>} input - Any input object to send to LangGraph
   * @param {Function} onChunk - Called for each chunk (node, data)
   * @param {string} streamMode - "updates" or "values" (default: "updates")
   * @returns {Promise<Record<string, unknown> | null>} Final output
   */
  async stream(
    input: Record<string, unknown>, 
    onChunk: (node: string, data: Record<string, unknown>) => void = () => {}, 
    streamMode: "updates" | "values" = "updates"
  ): Promise<Record<string, unknown> | null> {
    try {
      let finalOutput: Record<string, unknown> | null = null;

      // Start streaming
      const streamResponse = this.client.runs.stream(null, this.graphName, {
        input: input,
        streamMode: streamMode
      });

      // Process each chunk
      for await (const chunk of streamResponse) {
        for (const [node, data] of Object.entries(chunk as Record<string, Record<string, unknown>>)) {
          // Call the callback with node and data
          onChunk(node, data);
          
          // Check for final output
          if (data.output) {
            finalOutput = data.output as Record<string, unknown>;
          }
        }
      }

      return finalOutput;
    } catch (error) {
      console.error("Error streaming from LangGraph:", error);
      throw error;
    }
  }
}

// Recipe types
export interface RecipeIngredient {
  name: string;
  quantity: string;
  unit?: string;
}

export interface RecipeStep {
  number: number;
  instruction: string;
}

export interface RecipeMacros {
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
}

export interface RecipeMetadata {
  difficulty: 'easy' | 'medium' | 'hard';
  cuisineType: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'dessert' | 'snack' | 'appetizer';
  servings: number;
  totalTime: number;
  imagePrompt: string;
}

export interface Recipe {
  title: string;
  description: string;
  prepTime: number;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  macros: RecipeMacros;
  metadata: RecipeMetadata;
}

// Recipe generation service
export class RecipeService {
  private langGraph: LangGraphClient;
  private useMockData: boolean;
  
  constructor(options: { apiUrl?: string; graphName?: string; useMockData?: boolean } = {}) {
    this.langGraph = new LangGraphClient({
      apiUrl: options.apiUrl || "http://localhost:2024",
      graphName: options.graphName || "recipe-maestro"
    });
    this.useMockData = options.useMockData ?? true; // Default to using mock data
  }
  
  /**
   * Generate a recipe based on user preferences
   * @param params Recipe generation parameters
   * @param onUpdate Callback for streaming updates
   * @returns Generated recipe
   */
  async generateRecipe(
    params: {
      cuisine_type: string;
      skill_level: string;
      max_time: number;
      dietary_preferences: string[];
    },
    onUpdate: (node: string, data: Record<string, unknown>) => void = () => {}
  ): Promise<Recipe | null> {
    try {
      // Use mock data if enabled
      if (this.useMockData) {
        // Simulate streaming updates
        setTimeout(() => onUpdate('generate_recipe', { status: 'running' }), 500);
        setTimeout(() => onUpdate('format_recipe', { status: 'running' }), 1500);
        setTimeout(() => onUpdate('calculate_nutrition', { status: 'running' }), 2500);
        
        // Return mock recipe after delay
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(this.getMockRecipe(params));
          }, 3000);
        });
      }
      
      // Use actual LangGraph service
      const result = await this.langGraph.stream(params as Record<string, unknown>, onUpdate);
      return result as Recipe | null;
    } catch (error) {
      console.error("Error generating recipe:", error);
      
      // Fall back to mock data if there's an error
      if (!this.useMockData) {
        console.log("Falling back to mock data");
        return this.getMockRecipe(params);
      }
      
      throw error;
    }
  }
  
  /**
   * Generate a mock recipe based on user preferences
   */
  private getMockRecipe(params: {
    cuisine_type: string;
    skill_level: string;
    max_time: number;
    dietary_preferences: string[];
  }): Recipe {
    const { cuisine_type, skill_level, dietary_preferences } = params;
    
    // Adjust recipe based on cuisine type
    let title = "Delicious Pasta";
    let description = "A flavorful pasta dish";
    const cuisineDesc = cuisine_type || "Italian";
    
    if (cuisine_type === "italian" || !cuisine_type) {
      title = "Classic Spaghetti Aglio e Olio";
      description = "A simple yet flavorful Italian pasta dish with garlic, olive oil, and chili flakes.";
    } else if (cuisine_type === "mexican") {
      title = "Vegetarian Enchiladas";
      description = "Delicious plant-based enchiladas filled with beans, corn, and topped with a spicy sauce.";
    } else if (cuisine_type === "asian") {
      title = "Stir-Fried Vegetables with Tofu";
      description = "A quick and healthy stir-fry with crisp vegetables and protein-rich tofu in a savory sauce.";
    } else if (cuisine_type === "mediterranean") {
      title = "Greek Salad with Chickpeas";
      description = "A refreshing Mediterranean salad with crisp vegetables, chickpeas, and a light lemon dressing.";
    }
    
    // Adjust difficulty based on skill level
    const difficulty = skill_level === "advanced" ? "hard" : 
                      skill_level === "intermediate" ? "medium" : "easy";
    
    // Adjust ingredients based on dietary preferences
    const isVegetarian = dietary_preferences.includes("vegetarian");
    const isVegan = dietary_preferences.includes("vegan");
    const isGlutenFree = dietary_preferences.includes("gluten-free");
    
    // Create base recipe
    const recipe: Recipe = {
      title,
      description,
      prepTime: 15,
      ingredients: [
        { name: "pasta", quantity: "200", unit: "g" },
        { name: "olive oil", quantity: "3", unit: "tbsp" },
        { name: "garlic", quantity: "4", unit: "cloves" },
        { name: "red chili flakes", quantity: "1/2", unit: "tsp" },
        { name: "parsley", quantity: "2", unit: "tbsp" },
        { name: "salt", quantity: "to taste" },
        { name: "black pepper", quantity: "to taste" }
      ],
      steps: [
        { number: 1, instruction: "Bring a large pot of salted water to a boil." },
        { number: 2, instruction: "Cook pasta according to package instructions until al dente." },
        { number: 3, instruction: "While pasta cooks, heat olive oil in a large pan over medium heat." },
        { number: 4, instruction: "Add sliced garlic and chili flakes, cook until garlic is golden." },
        { number: 5, instruction: "Drain pasta, reserving 1/4 cup of pasta water." },
        { number: 6, instruction: "Add pasta to the pan with garlic oil, toss to coat." },
        { number: 7, instruction: "Add reserved pasta water if needed to create a light sauce." },
        { number: 8, instruction: "Season with salt and pepper, garnish with chopped parsley." }
      ],
      macros: {
        protein: 12,
        carbs: 65,
        fat: 15,
        calories: 450
      },
      metadata: {
        difficulty: difficulty as 'easy' | 'medium' | 'hard',
        cuisineType: cuisineDesc,
        mealType: "dinner",
        servings: 2,
        totalTime: 20,
        imagePrompt: `A delicious plate of ${title} garnished with fresh herbs.`
      }
    };
    
    // Modify recipe based on dietary preferences
    if (isGlutenFree) {
      // Replace pasta with gluten-free alternative
      recipe.ingredients[0].name = "gluten-free pasta";
      recipe.title = "Gluten-Free " + recipe.title;
    }
    
    if (isVegan) {
      // Remove any animal products
      recipe.title = "Vegan " + recipe.title;
      // Adjust macros for vegan version
      recipe.macros.protein = 10;
      recipe.macros.fat = 12;
      recipe.macros.calories = 420;
    } else if (isVegetarian && !recipe.title.includes("Vegetarian")) {
      recipe.title = "Vegetarian " + recipe.title;
    }
    
    return recipe;
  }
}

// Create a singleton instance for use throughout the app
export const recipeService = new RecipeService();
