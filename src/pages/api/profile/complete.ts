import { supabase } from '@/integrations/supabase/client';
import { 
  handleCORS, 
  validateMethod, 
  authenticateRequest,
  validateRequestBody,
  createSecureResponse,
  rateLimitCheck
} from '@/lib/auth-middleware';

export default async function handler(req: Request): Promise<Response> {
  // Handle CORS
  const corsResponse = handleCORS(req);
  if (corsResponse) return corsResponse;

  // Validate method
  const methodError = validateMethod(req, ['POST']);
  if (methodError) return methodError;

  // Basic rate limiting
  if (rateLimitCheck(req, 60000, 30)) {
    return createSecureResponse(
      { error: 'Too many requests', success: false },
      429
    );
  }

  try {
    // Authenticate request
    const { error: authError, user } = await authenticateRequest(req);
    if (authError) return authError;

    // Validate request body
    const { error: bodyError, body } = await validateRequestBody(req, ['full_name']);
    if (bodyError) return bodyError;

    const { 
      full_name, 
      company_name, 
      job_title, 
      industry, 
      company_size, 
      department, 
      use_case,
      phone_number 
    } = body;

    // Validate required fields
    if (!full_name || typeof full_name !== 'string' || full_name.trim().length < 1) {
      return createSecureResponse(
        { error: 'Valid full name is required', success: false },
        400
      );
    }

    // Update the user profile
    const { data, error: updateError } = await supabase
      .from('profiles')
      .update({
        full_name: full_name.trim(),
        company_name: company_name?.trim() || null,
        job_title: job_title?.trim() || null,
        industry: industry?.trim() || null,
        company_size: company_size?.trim() || null,
        department: department?.trim() || null,
        use_case: use_case?.trim() || null,
        phone_number: phone_number?.trim() || null,
        profile_completed: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('Profile update error:', updateError);
      return createSecureResponse(
        { error: 'Failed to update profile', success: false },
        500
      );
    }

    return createSecureResponse({
      success: true,
      data: {
        profile: data
      }
    }, 200);
  } catch (error) {
    console.error('Complete profile error:', error);
    return createSecureResponse(
      { error: 'Internal server error', success: false },
      500
    );
  }
}