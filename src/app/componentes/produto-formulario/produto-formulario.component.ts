import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IconeComponent } from '../icone/icone.component';
import { DadosProduto, Produto } from '../../modelos/produto.modelo';
import { ProdutoServico } from '../../servicos/produto.servico';
import { mensagemDeErro } from '../../utilitarios/mensagem-de-erro';

const TIPOS_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp'];
const TAMANHO_MAXIMO_EM_BYTES = 1.5 * 1024 * 1024;
const QUANTIDADE_MAXIMA_DE_IMAGENS = 3;

@Component({
  selector: 'app-produto-formulario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IconeComponent],
  templateUrl: './produto-formulario.component.html',
  styleUrls: ['./produto-formulario.component.css'],
})
export class ProdutoFormularioComponent implements OnInit {
  /** Produto a editar; nulo quando é um novo cadastro. */
  @Input() produto: Produto | null = null;
  @Output() salvo = new EventEmitter<void>();
  @Output() cancelado = new EventEmitter<void>();

  categorias = ['Maquiagem', 'Skin care', 'Perfumaria'];
  formulario = this.construtor.nonNullable.group({
    nome: ['', [Validators.required, Validators.maxLength(120)]],
    preco: ['', [Validators.required, Validators.pattern(/^\d+([.,]\d{1,2})?$/)]],
    categoria: ['Maquiagem', Validators.required],
  });
  imagensEscolhidas: File[] = [];
  previas: string[] = [];
  salvando = false;
  erro = '';

  constructor(private construtor: FormBuilder, private produtoServico: ProdutoServico) {}

  get editando(): boolean {
    return this.produto !== null;
  }

  ngOnInit(): void {
    if (!this.produto) return;
    this.formulario.patchValue({
      nome: this.produto.nome,
      preco: this.produto.preco.toFixed(2).replace('.', ','),
      categoria: this.produto.categoria,
    });
  }

  get imagensExibidas(): string[] {
    if (this.previas.length > 0) return this.previas;
    return this.produto?.imagens?.length ? this.produto.imagens : this.produto ? [this.produto.imagem] : [];
  }

  @HostListener('document:keydown.escape')
  cancelar(): void {
    if (!this.salvando) this.cancelado.emit();
  }

  escolherImagens(evento: Event): void {
    const entrada = evento.target as HTMLInputElement;
    const arquivos = Array.from(entrada.files ?? []);
    entrada.value = '';
    if (arquivos.length === 0) return;

    if (arquivos.length > QUANTIDADE_MAXIMA_DE_IMAGENS) {
      this.erro = 'Escolha no máximo 3 fotos para o produto.';
      return;
    }
    if (arquivos.some((arquivo) => !TIPOS_PERMITIDOS.includes(arquivo.type))) {
      this.erro = 'Envie uma imagem JPG, PNG ou WEBP.';
      return;
    }
    if (arquivos.some((arquivo) => arquivo.size > TAMANHO_MAXIMO_EM_BYTES)) {
      this.erro = 'Cada imagem deve ter no máximo 1,5 MB.';
      return;
    }

    this.erro = '';
    Promise.all(arquivos.map((arquivo) => this.lerImagem(arquivo))).then(
      (previas) => {
        this.imagensEscolhidas = arquivos;
        this.previas = previas;
      },
      () => {
        this.erro = 'Não foi possível carregar a prévia das imagens. Tente novamente.';
      }
    );
  }

  salvar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    if (!this.editando && this.imagensEscolhidas.length === 0) {
      this.erro = 'Escolha pelo menos uma foto para o produto.';
      return;
    }

    this.salvando = true;
    this.erro = '';
    const requisicao = this.produto
      ? this.produtoServico.atualizar(this.produto.id, this.montarDados())
      : this.produtoServico.criar(this.montarDados());

    requisicao.subscribe({
      next: () => this.salvo.emit(),
      error: (erro) => {
        this.erro = mensagemDeErro(erro, 'Não foi possível salvar o produto.');
        this.salvando = false;
      },
    });
  }

  private montarDados(): DadosProduto {
    const { nome, preco, categoria } = this.formulario.getRawValue();
    return {
      nome: nome.trim(),
      preco: Number(preco.replace(',', '.')),
      categoria,
      imagens: this.imagensEscolhidas,
    };
  }

  private lerImagem(arquivo: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const leitor = new FileReader();
      leitor.onload = () => {
        if (typeof leitor.result === 'string') resolve(leitor.result);
        else reject(new Error('Formato de prévia de imagem inválido.'));
      };
      leitor.onerror = () => reject(leitor.error ?? new Error('Falha ao ler imagem.'));
      leitor.readAsDataURL(arquivo);
    });
  }
}
