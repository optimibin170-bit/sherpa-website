CREATE TABLE public.proposal_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  phone TEXT,
  service_slug TEXT,
  service_title TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.proposal_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit proposal requests"
ON public.proposal_requests
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(trim(customer_name)) > 0
  AND customer_email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
);

CREATE INDEX idx_proposal_requests_created_at ON public.proposal_requests (created_at DESC);
CREATE INDEX idx_proposal_requests_status ON public.proposal_requests (status);